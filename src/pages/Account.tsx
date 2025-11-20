import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile, updateProfile, updatePassword, type Profile, type UpdateProfileData } from '@/lib/profile';
import { getUserOrders } from '@/lib/orders';
import { Order } from '@/types/order';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, User, Package, Lock, LogOut, Edit2, Save, X, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import { formatCurrency } from '@/lib/utils';
import { ImageWithFallback } from '@/components/ImageWithFallback';

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  paid: 'Payée',
  processing: 'En traitement',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

const statusColors: Record<string, string> = {
  pending: 'default',
  paid: 'secondary',
  processing: 'default',
  shipped: 'outline',
  delivered: 'outline',
  cancelled: 'destructive',
};

export default function Account() {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // État du formulaire de profil
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<UpdateProfileData>({
    full_name: '',
    phone: '',
    address: {
      street: '',
      city: '',
      postal_code: '',
      country: '',
    },
  });

  // État du formulaire de mot de passe
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // Rediriger si non connecté
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
      toast.info('Veuillez vous connecter pour accéder à votre compte');
    }
  }, [user, authLoading, navigate]);

  // Charger le profil et les commandes
  useEffect(() => {
    if (user) {
      loadProfileAndOrders();
    }
  }, [user]);

  const loadProfileAndOrders = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [profileData, ordersData] = await Promise.all([
        getProfile(user.id),
        getUserOrders(user.id),
      ]);

      if (profileData) {
        setProfile(profileData);
        setProfileForm({
          full_name: profileData.full_name || '',
          phone: profileData.phone || '',
          address: profileData.address || {
            street: '',
            city: '',
            postal_code: '',
            country: '',
          },
        });
      }

      setOrders(ordersData);
    } catch (error) {
      logger.error('Error loading profile and orders', error, 'Account');
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const updatedProfile = await updateProfile(user.id, profileForm);
      if (updatedProfile) {
        setProfile(updatedProfile);
        setIsEditingProfile(false);
        toast.success('Profil mis à jour avec succès');
      } else {
        toast.error('Erreur lors de la mise à jour du profil');
      }
    } catch (error) {
      logger.error('Error updating profile', error, 'Account');
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
      if (error) {
        toast.error(error.message || 'Erreur lors de la modification du mot de passe');
      } else {
        toast.success('Mot de passe modifié avec succès');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      logger.error('Error changing password', error, 'Account');
      toast.error('Erreur lors de la modification du mot de passe');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: 'Mon compte' }]} />

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mon compte</h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles, consultez vos commandes et modifiez vos paramètres de sécurité
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Commandes</span>
              {orders.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {orders.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Sécurité</span>
            </TabsTrigger>
          </TabsList>

          {/* Onglet Profil */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Informations personnelles</CardTitle>
                    <CardDescription>Gérez vos informations de profil</CardDescription>
                  </div>
                  {!isEditingProfile ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingProfile(true)}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsEditingProfile(false);
                          // Réinitialiser le formulaire
                          if (profile) {
                            setProfileForm({
                              full_name: profile.full_name || '',
                              phone: profile.phone || '',
                              address: profile.address || {
                                street: '',
                                city: '',
                                postal_code: '',
                                country: '',
                              },
                            });
                          }
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Annuler
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveProfile}
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Enregistrement...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Enregistrer
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={profile?.email || user.email || ''}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      L'email ne peut pas être modifié
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full_name">Nom complet</Label>
                    {isEditingProfile ? (
                      <Input
                        id="full_name"
                        value={profileForm.full_name || ''}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, full_name: e.target.value })
                        }
                        placeholder="Votre nom complet"
                      />
                    ) : (
                      <Input
                        value={profile?.full_name || 'Non renseigné'}
                        disabled
                        className="bg-muted"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    {isEditingProfile ? (
                      <Input
                        id="phone"
                        value={profileForm.phone || ''}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, phone: e.target.value })
                        }
                        placeholder="+212 6 12 34 56 78"
                      />
                    ) : (
                      <Input
                        value={profile?.phone || 'Non renseigné'}
                        disabled
                        className="bg-muted"
                      />
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Adresse</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="street">Rue</Label>
                      {isEditingProfile ? (
                        <Input
                          id="street"
                          value={profileForm.address?.street || ''}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              address: { ...profileForm.address, street: e.target.value },
                            })
                          }
                          placeholder="Numéro et nom de rue"
                        />
                      ) : (
                        <Input
                          value={profile?.address?.street || 'Non renseigné'}
                          disabled
                          className="bg-muted"
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">Ville</Label>
                      {isEditingProfile ? (
                        <Input
                          id="city"
                          value={profileForm.address?.city || ''}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              address: { ...profileForm.address, city: e.target.value },
                            })
                          }
                          placeholder="Ville"
                        />
                      ) : (
                        <Input
                          value={profile?.address?.city || 'Non renseigné'}
                          disabled
                          className="bg-muted"
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postal_code">Code postal</Label>
                      {isEditingProfile ? (
                        <Input
                          id="postal_code"
                          value={profileForm.address?.postal_code || ''}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              address: { ...profileForm.address, postal_code: e.target.value },
                            })
                          }
                          placeholder="00000"
                        />
                      ) : (
                        <Input
                          value={profile?.address?.postal_code || 'Non renseigné'}
                          disabled
                          className="bg-muted"
                        />
                      )}
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="country">Pays</Label>
                      {isEditingProfile ? (
                        <Input
                          id="country"
                          value={profileForm.address?.country || ''}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              address: { ...profileForm.address, country: e.target.value },
                            })
                          }
                          placeholder="Maroc"
                        />
                      ) : (
                        <Input
                          value={profile?.address?.country || 'Non renseigné'}
                          disabled
                          className="bg-muted"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Commandes */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Historique des commandes</CardTitle>
                <CardDescription>
                  Consultez toutes vos commandes passées
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Aucune commande pour le moment</p>
                    <Button onClick={() => navigate('/categories')}>
                      Parcourir les produits
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">
                                Commande {order.order_number}
                              </h3>
                              <Badge variant={statusColors[order.status] as any}>
                                {statusLabels[order.status] || order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Passée le {new Date(order.created_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              {formatCurrency(order.total)} FCFA
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {order.items.length} article{order.items.length > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          {order.items.slice(0, 4).map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg"
                            >
                              <ImageWithFallback
                                src={item.product_image}
                                alt={item.product_name}
                                className="w-12 h-12 object-cover rounded"
                                loading="lazy"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {item.product_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Qté: {item.quantity} × {formatCurrency(item.price)} FCFA
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.items.length > 4 && (
                            <div className="flex items-center justify-center text-sm text-muted-foreground">
                              +{order.items.length - 4} autre{order.items.length - 4 > 1 ? 's' : ''}
                            </div>
                          )}
                        </div>

                        {order.shipping_address && (
                          <div className="text-sm text-muted-foreground">
                            <p>
                              <strong>Adresse de livraison:</strong>{' '}
                              {order.shipping_address.street}, {order.shipping_address.city},{' '}
                              {order.shipping_address.postal_code}, {order.shipping_address.country}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Sécurité */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Modifier le mot de passe</CardTitle>
                  <CardDescription>
                    Choisissez un mot de passe fort pour sécuriser votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPasswords.current ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              currentPassword: e.target.value,
                            })
                          }
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              current: !showPasswords.current,
                            })
                          }
                        >
                          {showPasswords.current ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPasswords.new ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              newPassword: e.target.value,
                            })
                          }
                          required
                          minLength={6}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              new: !showPasswords.new,
                            })
                          }
                        >
                          {showPasswords.new ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Minimum 6 caractères
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              confirmPassword: e.target.value,
                            })
                          }
                          required
                          minLength={6}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              confirm: !showPasswords.confirm,
                            })
                          }
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button type="submit" disabled={changingPassword}>
                      {changingPassword ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Modification...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Modifier le mot de passe
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Déconnexion</CardTitle>
                  <CardDescription>
                    Déconnectez-vous de votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="destructive" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

