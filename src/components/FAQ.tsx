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
      question: "What is WAIFU token?",
      answer: "WAIFU is the utility token for our VTuber ecosystem. Use it for tipping and interacting with the stream. Built on Abstract blockchain for fast, cheap transactions."
    },
    {
      question: "How do I buy WAIFU tokens?",
      answer: "Connect your wallet to Abstract testnet and use our token sale interface. Current rate: 1 ETH = 1,000 WAIFU tokens. Max 10 ETH per wallet."
    },
    {
      question: "How do I get testnet ETH?",
      answer: "Get free testnet ETH from Abstract faucets (Triangle faucet or Thirdweb faucet). Check Abstract documentation for links."
    },
    {
      question: "How does tipping work?",
      answer: "Tip the VTuber using ETH or WAIFU tokens directly from the website. Tips are processed through smart contracts instantly."
    },
    {
      question: "Is this real money?",
      answer: "No, we're on Abstract testnet. All transactions use testnet ETH with no real value. This is for testing only."
    },
    {
      question: "Where can I watch the stream?",
      answer: "Click the 'Watch Live Stream' button to open the waifu's 24/7 stream on Abstract in a new tab."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
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
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
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
  );
}
