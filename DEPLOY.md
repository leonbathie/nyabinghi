# Déploiement automatique sur VPS

À chaque `git push` sur la branche `main`, GitHub Actions se connecte au VPS en SSH et tire les nouveaux fichiers.

---

## 1. Préparation du VPS (à faire UNE FOIS)

Connecte-toi en SSH :

```bash
ssh ousmane@173.249.2.195
```

### a) Installer Nginx + Git

```bash
sudo apt update
sudo apt install -y nginx git
```

### b) Cloner le repo dans `/var/www/nyabinghi`

```bash
sudo mkdir -p /var/www
sudo chown -R ousmane:ousmane /var/www
cd /var/www
git clone https://github.com/leonbathie/nyabinghi.git
```

### c) Configurer Nginx

```bash
sudo nano /etc/nginx/sites-available/nyabinghi
```

Colle ce contenu :

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name 173.249.2.195;  # remplace par ton domaine plus tard

    root /var/www/nyabinghi;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Cache assets statiques
    location ~* \.(jpg|jpeg|png|webp|avif|gif|svg|css|js|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Sécurité basique
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
}
```

Active le site et reload :

```bash
sudo ln -sf /etc/nginx/sites-available/nyabinghi /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

Le site est maintenant accessible sur **http://173.249.2.195**

### d) Générer une clé SSH dédiée pour GitHub Actions

Toujours sur le VPS :

```bash
ssh-keygen -t ed25519 -f ~/.ssh/github_deploy -N "" -C "github-actions-deploy"
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
cat ~/.ssh/github_deploy
```

⚠️ **Copie tout ce que la dernière commande affiche** (la clé privée, de `-----BEGIN OPENSSH PRIVATE KEY-----` à `-----END OPENSSH PRIVATE KEY-----`). Tu en as besoin à l'étape 2.

---

## 2. Configuration des secrets GitHub

Va sur ton repo : **Settings → Secrets and variables → Actions → New repository secret**

Crée 3 secrets :

| Nom            | Valeur                                                |
| -------------- | ----------------------------------------------------- |
| `VPS_HOST`     | `173.249.2.195`                                       |
| `VPS_USER`     | `ousmane`                                             |
| `VPS_SSH_KEY`  | la clé privée copiée à l'étape 1d (avec les BEGIN/END) |

(Optionnel : `VPS_PORT` si SSH n'est pas sur 22)

---

## 3. Tester

Fais un petit changement, commit et push :

```bash
git add .
git commit -m "test deploy"
git push
```

Va sur l'onglet **Actions** de ton repo GitHub : tu verras le workflow `Deploy to VPS` tourner. En 10-20 secondes, le site sur `http://173.249.2.195` est mis à jour.

---

## 4. Domaine personnalisé (plus tard)

Quand tu auras un domaine (ex: `nyabinghi.sn`) :

1. Pointe l'enregistrement A vers `173.249.2.195`
2. Sur le VPS, modifie `server_name` dans la config Nginx avec ton domaine
3. Installe HTTPS avec Certbot :

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d nyabinghi.sn -d www.nyabinghi.sn
```
