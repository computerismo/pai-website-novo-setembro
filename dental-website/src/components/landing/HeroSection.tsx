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
  onPrimaryAction?: () => void;
  backgroundImage?: string;
  variant?: 'centered' | 'left-aligned' | 'split';
}

export function HeroSection({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  onPrimaryAction,
  backgroundImage,
  variant = 'split',
}: HeroSectionProps) {
  if (variant === 'split') {
    return (
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-blue-25 to-teal-50 pt-32 md:pt-24">
        {/* Background Pattern Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200/40 to-blue-300/20 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-gradient-to-br from-teal-200/30 to-cyan-300/20 rounded-full filter blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-100/50 to-blue-200/30 rounded-full filter blur-2xl"></div>
        </div>

        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(59 130 246 / 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Content Background Card */}
            <div className="absolute inset-0 bg-neutral-50 rounded-3xl border border-neutral-200 shadow-xl -m-8 p-8"></div>

            <div className="relative z-10">
              {/* Enhanced Typography */}
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-teal-800 bg-clip-text text-transparent">
                  {title}
                </span>
              </h1>

              {description && (
                <p className="text-xl text-gray-700 leading-relaxed font-medium mb-8 max-w-3xl mx-auto">
                  {description}
                </p>
              )}
            </div>

            {/* Enhanced CTA Section */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10 w-full sm:w-auto">
              {onPrimaryAction ? (
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  onClick={onPrimaryAction}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  {primaryCTA.text}
                </Button>
              ) : (
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200" asChild>
                  <a href={primaryCTA.href}>
                    <Calendar className="w-5 h-5 mr-2" />
                    {primaryCTA.text}
                  </a>
                </Button>
              )}

              {secondaryCTA && (
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-teal-600 text-teal-700 hover:bg-teal-50 hover:border-teal-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200" asChild>
                  <a href={secondaryCTA.href}>
                    <Phone className="w-5 h-5 mr-2" />
                    {secondaryCTA.text}
                  </a>
                </Button>
              )}
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
          {onPrimaryAction ? (
             <Button size="lg" onClick={onPrimaryAction}>
               {primaryCTA.text}
             </Button>
          ) : (
            <Button size="lg" asChild>
              <a href={primaryCTA.href}>{primaryCTA.text}</a>
            </Button>
          )}

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