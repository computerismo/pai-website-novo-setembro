import { Button } from '@/components/ui/Button';
import { Phone, Calendar, ChevronDown, Stethoscope, Shield, Heart } from 'lucide-react';

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

          <div className="relative h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 shadow-2xl">
            {/* Gradient Background with Design Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/90 via-indigo-600/90 to-purple-700/90"></div>

            {/* Decorative Elements */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-blue-300/20 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-purple-300/15 rounded-full blur-lg"></div>

            {/* Medical Icons */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-8 opacity-20">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Overlay Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/30">
                  <Stethoscope className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Cuidado Profissional</h3>
                <p className="text-white/90 leading-relaxed">
                  Especialistas dedicados ao seu bem-estar e qualidade de vida
                </p>
              </div>
            </div>
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