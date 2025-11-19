import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';

const Terms = () => {
  const { settings } = useSiteSettings();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Conditions Générales de Vente</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {settings.terms_of_sale ? (
                <div className="whitespace-pre-line text-muted-foreground">
                  {settings.terms_of_sale}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    Les conditions générales de vente n'ont pas encore été configurées.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Veuillez contacter l'administrateur du site.
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

export default Terms;

