import { Button } from '@/components/ui/Button';
import { Phone, Calendar, ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description?: string;
  primaryCTA: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  backgroundImage?: string;
  variant?: 'centered' | 'left-aligned' | 'split';
}

export function HeroSection({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  backgroundImage,
  variant = 'split',
}: HeroSectionProps) {
  if (variant === 'split') {
    return (
      <section className="relative min-h-[90vh] flex items-center">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div>
              <p className="text-primary-500 font-medium mb-2">{subtitle}</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                {title}
              </h1>
              {description && (
                <p className="text-xl text-gray-600">{description}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <a href={primaryCTA.href}>
                  <Calendar className="w-5 h-5" />
                  {primaryCTA.text}
                </a>
              </Button>

              {secondaryCTA && (
                <Button size="lg" variant="outline" asChild>
                  <a href={secondaryCTA.href}>
                    <Phone className="w-5 h-5" />
                    {secondaryCTA.text}
                  </a>
                </Button>
              )}
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">★★★★★</span>
                <span className="text-sm text-gray-600">4.9/5 no Google</span>
              </div>
              <div className="text-sm text-gray-600">
                +500 pacientes atendidos
              </div>
            </div>
          </div>

          <div className="relative h-[500px] rounded-2xl overflow-hidden">
            <Image
              src={backgroundImage || '/images/hero-dentist.jpg'}
              alt="Consultório odontológico"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center text-center"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
      }}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
      )}

      <div className="container mx-auto px-4 relative z-10 max-w-4xl">
        <p className="text-primary-400 font-medium mb-4">{subtitle}</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          {title}
        </h1>
        {description && (
          <p className="text-xl text-white/90 mb-8">{description}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <a href={primaryCTA.href}>{primaryCTA.text}</a>
          </Button>

          {secondaryCTA && (
            <Button size="lg" variant="outline" asChild>
              <a href={secondaryCTA.href}>{secondaryCTA.text}</a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}