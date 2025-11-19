import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createContactMessage } from '@/lib/contact';
import { logger } from '@/lib/logger';
import { contactSchema } from '@/lib/validations';
import { z } from 'zod';

const Contact = () => {
  const { settings } = useSiteSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    try {
      // Valider les données avec Zod
      const validatedData = contactSchema.parse(formData);

      await createContactMessage({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || undefined,
        subject: validatedData.subject,
        message: validatedData.message,
      });

      toast.success('Message envoyé avec succès ! Nous vous répondrons sous 24h.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Gérer les erreurs de validation
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setFormErrors(errors);
        
        // Afficher le premier message d'erreur
        const firstError = error.errors[0];
        if (firstError) {
          toast.error(firstError.message);
        }
      } else {
        logger.error('Error submitting contact form', error, 'Contact');
        toast.error('Erreur lors de l\'envoi du message. Veuillez réessayer.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contactez-nous</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Notre équipe est à votre disposition pour répondre à toutes vos questions
            </p>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-6">Nos Coordonnées</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Adresse</h3>
                      <p className="text-muted-foreground">{settings.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Téléphone</h3>
                      <p className="text-muted-foreground">{settings.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-muted-foreground">{settings.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Horaires</h3>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {settings.opening_hours || 'Lundi - Vendredi: 9h - 18h\nSamedi: 10h - 16h\nDimanche: Fermé'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-muted rounded-lg overflow-hidden h-64">
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p>Plan de localisation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={(e) => {
                          handleChange(e);
                          if (formErrors.name) setFormErrors(prev => ({ ...prev, name: '' }));
                        }}
                        required
                        placeholder="Jean Dupont"
                        className={formErrors.name ? 'border-destructive' : ''}
                      />
                      {formErrors.name && (
                        <p className="text-sm text-destructive mt-1">{formErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          handleChange(e);
                          if (formErrors.email) setFormErrors(prev => ({ ...prev, email: '' }));
                        }}
                        required
                        placeholder="jean.dupont@email.com"
                        className={formErrors.email ? 'border-destructive' : ''}
                      />
                      {formErrors.email && (
                        <p className="text-sm text-destructive mt-1">{formErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          handleChange(e);
                          if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: '' }));
                        }}
                        placeholder="+33 6 12 34 56 78"
                        className={formErrors.phone ? 'border-destructive' : ''}
                      />
                      {formErrors.phone && (
                        <p className="text-sm text-destructive mt-1">{formErrors.phone}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="subject">Sujet *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={(e) => {
                          handleChange(e);
                          if (formErrors.subject) setFormErrors(prev => ({ ...prev, subject: '' }));
                        }}
                        required
                        placeholder="Demande d'information"
                        className={formErrors.subject ? 'border-destructive' : ''}
                      />
                      {formErrors.subject && (
                        <p className="text-sm text-destructive mt-1">{formErrors.subject}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={(e) => {
                        handleChange(e);
                        if (formErrors.message) setFormErrors(prev => ({ ...prev, message: '' }));
                      }}
                      required
                      placeholder="Décrivez votre demande..."
                      rows={6}
                      className={formErrors.message ? 'border-destructive' : ''}
                    />
                    {formErrors.message && (
                      <p className="text-sm text-destructive mt-1">{formErrors.message}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      'Envoyer le message'
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Questions Fréquentes</h2>
              <p className="text-muted-foreground">
                Retrouvez les réponses aux questions les plus fréquentes
              </p>
            </div>
            <div className="max-w-3xl mx-auto space-y-6">
              {settings.faq_content && settings.faq_content.length > 0 ? (
                settings.faq_content.map((faq, i) => (
                  <div key={i} className="bg-card p-6 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Aucune question fréquente n'a été configurée pour le moment.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
