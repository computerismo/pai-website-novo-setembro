'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Calendar } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { LeadForm } from '@/components/landing/LeadForm';
import { trackFormModalOpen } from '@/lib/analytics/gtag';

interface ScheduleModalButtonProps {
  source?: string;
  label?: string;
}

export function ScheduleModalButton({ 
  source = 'website',
  label = 'Agendar Diagnóstico' 
}: ScheduleModalButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button 
        size="xl" 
        className="bg-white text-blue-900 hover:bg-blue-50 font-semibold border-none"
        onClick={() => {
          setIsOpen(true);
          trackFormModalOpen(source);
        }}
      >
        <Calendar className="w-5 h-5 mr-2" />
        {label}
      </Button>

      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        title="Agendar Diagnóstico"
      >
        <p className="text-sm text-gray-500 mb-4">
          Preencha seus dados abaixo e nossa equipe entrará em contato para agendar sua avaliação.
        </p>
        <LeadForm 
          source={source}
          isInModal={true}
          onSuccess={() => setTimeout(() => setIsOpen(false), 3000)}
        />
      </Modal>
    </>
  );
}
