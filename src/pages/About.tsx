import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { getIcon } from '@/lib/iconMap';

const About = () => {
  const { settings } = useSiteSettings();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">À Propos de {settings.siteName}</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {settings.about_hero_description || 'Votre partenaire de confiance pour tous vos besoins en matériel informatique et high-tech depuis 2015'}
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto space-y-6 text-lg text-muted-foreground">
            <p className="whitespace-pre-line">
              {settings.aboutText}
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Nos Valeurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(settings.about_values || []).map((value, i) => {
                const IconComponent = getIcon(value.icon);
                return (
                  <div key={i} className="bg-card p-6 rounded-lg text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {(settings.about_stats || []).map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-primary">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Notre Équipe</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Une équipe passionnée et dévouée, toujours à votre écoute
              </p>
            </div>
            <div className="max-w-3xl mx-auto bg-card p-8 rounded-lg text-center">
              <p className="text-lg text-muted-foreground whitespace-pre-line">
                {settings.about_team_text || 'Notre équipe de professionnels expérimentés travaille chaque jour pour vous offrir la meilleure expérience possible. Du service client au support technique, en passant par la logistique, chaque membre contribue à notre succès commun.'}
              </p>
            </div>
          </div>
        </section>

        {/* Commitment Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Notre Engagement</h2>
            <p className="text-lg text-muted-foreground whitespace-pre-line">
              {settings.about_commitment_text || 'Chez Sana Distribution, nous nous engageons à vous fournir des produits authentiques, un service client réactif, une livraison rapide et sécurisée, ainsi qu\'un retour gratuit sous 30 jours. Votre satisfaction est notre priorité absolue.'}
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
