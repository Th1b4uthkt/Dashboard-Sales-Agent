export interface Tag {
  id: string;  // UUID dans la base de données
  name: string;
  color?: string;  // Optionnel, car il peut être null dans la base de données
  created_at?: string;  // Ajouté pour correspondre à la structure de la base de données
}

export interface Prospect {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  country_code: string;
  phone: string;
  address: string;
  status: string;
  provider: string;
  tags: Tag[];
  created_at: string;
  updated_at: string;
}
