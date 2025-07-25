'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqData = [
    {
      question: "Lorem ipsum dolor sit amet?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      question: "Ut enim ad minim veniam?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
      question: "Duis aute irure dolor in reprehenderit?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
      question: "Excepteur sint occaecat cupidatat non proident?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
      question: "Sed ut perspiciatis unde omnis iste natus error sit?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
    }
  ];

  return (
    <section className="py-12 lg:py-16 relative overflow-hidden section-bg-faq section-transition-border">
      {/* Enhanced background to complete visual hierarchy with clear distinction */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/88 via-waifu-pink/9 to-background/90" />
      <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-waifu-purple/4 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Quick answers about tokens and tipping
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqData.map((item, index) => (
            <div key={index}>
              <Card className="overflow-hidden">
                <CardHeader 
                  className="cursor-pointer  transition-colors"
                  onClick={() => toggleItem(index)}
                >
                  <CardTitle className="flex items-center justify-between text-left">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-waifu-pink flex-shrink-0" />
                      <span className="text-base font-medium">{item.question}</span>
                    </div>
                    {openItems.includes(index) ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </CardTitle>
                </CardHeader>
                {openItems.includes(index) && (
                  <div>
                    <CardContent className="pt-0">
                      <div className="pl-8 pr-4 pb-4">
                        <p className="text-muted-foreground leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </CardContent>
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="text-center pt-8">
          <Card className="max-w-md mx-auto bg-gradient-to-r from-waifu-pink/10 to-waifu-purple/10 border-waifu-pink/20">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <h3 className="font-semibold">Still have questions?</h3>
                <p className="text-sm text-muted-foreground">
                  Join our community or reach out to our team for more information
                </p>
                <div className="flex justify-center gap-2 text-sm">
                  <span className="px-3 py-1 bg-muted rounded-full">Discord</span>
                  <span className="px-3 py-1 bg-muted rounded-full">Twitter</span>
                  <span className="px-3 py-1 bg-muted rounded-full">Telegram</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </section>
  );
}
