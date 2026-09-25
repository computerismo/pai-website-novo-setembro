'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { useUTMParams } from '@/lib/hooks/useUTMParams';
import { trackLead, trackFormView } from '@/lib/analytics/gtag';

const schema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome.').max(100),
  email: z.string().trim().max(254).email('Informe um e-mail válido.'),
  phone: z.string().trim().min(8, 'Informe um telefone válido.').max(24).regex(/^[+\d\s().-]+$/),
  acceptTerms: z.boolean().refine((value) => value, {
    message: 'Autorize o contato para continuar.',
  }),
  website: z.string().max(0),
});

type FormData = z.infer<typeof schema>;

interface LeadFormProps {
  campaignId?: string;
  source?: string;
  onSuccess?: () => void;
  isInModal?: boolean;
}

export function LeadForm({
  campaignId,
  source = 'website',
  onSuccess,
  isInModal = false,
}: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { utmParams } = useUTMParams();

  useEffect(() => {
    if (!isInModal) trackFormView(source);
  }, [isInModal, source]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    if (data.website) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          acceptTerms: data.acceptTerms,
          website: data.website,
          campaignId,
          source,
          utm_source: utmParams.utm_source,
          utm_medium: utmParams.utm_medium,
          utm_campaign: utmParams.utm_campaign,
        }),
      });

      if (!response.ok) throw new Error('Lead submission failed');
      setSubmitSuccess(true);
      reset();
      onSuccess?.();
      trackLead();
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch {
      console.error('lead_form_submit_failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          Formulário enviado com sucesso! Entraremos em contato em breve.
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
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <div className="max-w-md">
        <Input
          label="WhatsApp"
          placeholder="(11) 99999-9999"
          error={errors.phone?.message}
          {...register('phone')}
        />
      </div>

      <Checkbox
        label="Autorizo a equipe a entrar em contato sobre minha solicitação."
        error={errors.acceptTerms?.message}
        {...register('acceptTerms')}
      />

      <input
        type="text"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        {...register('website')}
      />

      <Button
        type="submit"
        size="lg"
        fullWidth
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Enviando...' : 'Solicitar avaliação'}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Não inclua informações clínicas neste formulário.
      </p>
    </form>
  );
}
