'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { useUTMParams } from '@/lib/hooks/useUTMParams';
import { trackLead, trackFormView } from '@/lib/analytics/gtag';

const schema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  treatment: z.string().min(1, 'Selecione um tratamento'),
  message: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Você deve aceitar os termos',
  }),
  website: z.string().max(0), // Honeypot
});

type FormData = z.infer<typeof schema>;

interface LeadFormProps {
  campaignId?: string;
  source?: string;
  onSuccess?: () => void;
  isInModal?: boolean;
}

export function LeadForm({ campaignId, source = 'website', onSuccess, isInModal = false }: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { utmParams } = useUTMParams();

  // Track form view on static pages (not in modal)
  // If in modal, parent component already tracked the "Open" event
  useEffect(() => {
    if (!isInModal) {
      trackFormView(source);
    }
  }, [isInModal, source]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // Honeypot check
    if (data.website) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          campaignId,
          source,
          timestamp: new Date().toISOString(),
          page: window.location.pathname,
          ...utmParams,
        }),
      });

      if (!response.ok) throw new Error('Erro ao enviar');

      setSubmitSuccess(true);
      reset();
      onSuccess?.();

      // Track conversion
      trackLead({
        treatment: data.treatment,
        page: window.location.pathname,
        ...utmParams,
      });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const treatmentOptions = [
    { value: 'bruxismo', label: 'Tratamento de Bruxismo' },
    { value: 'placa', label: 'Placa Miorrelaxante' },
    { value: 'botox', label: 'Aplicação de Botox' },
    { value: 'dtm', label: 'Disfunção Temporomandibular' },
    { value: 'avaliacao', label: 'Avaliação Diagnóstica' },
    { value: 'outros', label: 'Outros Tratamentos' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          ✓ Formulário enviado com sucesso! Entraremos em contato em breve.
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Nome completo"
          placeholder="Seu nome"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="seu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="WhatsApp"
          placeholder="(11) 99999-9999"
          error={errors.phone?.message}
          {...register('phone')}
        />

        <Select
          label="Tratamento de interesse"
          options={treatmentOptions}
          error={errors.treatment?.message}
          {...register('treatment')}
        />
      </div>

      <Input
        label="Mensagem (opcional)"
        placeholder="Conte-nos mais sobre seu caso..."
        {...register('message')}
      />

      <Checkbox
        label="Aceito receber contato sobre o tratamento e informações relacionadas"
        error={errors.acceptTerms?.message}
        {...register('acceptTerms')}
      />

      {/* Honeypot field - hidden from users */}
      <input
        type="text"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        {...register('website')}
      />

      <Button
        type="submit"
        size="lg"
        fullWidth
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Enviando...' : 'Solicitar Avaliação'}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Suas informações estão seguras e não serão compartilhadas com terceiros.
      </p>
    </form>
  );
}