# DevOps Infrastructure Reference

## Server Hardening Checklist

### SSH Security
```bash
# /etc/ssh/sshd_config
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
AllowUsers deploy
MaxAuthTries 3

sudo systemctl restart sshd
```

### UFW Firewall
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

### Fail2ban
```bash
sudo apt install fail2ban

# /etc/fail2ban/jail.local
[sshd]
enabled = true
maxretry = 3
bantime = 3600
```

### Auto Updates
```bash
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

---

## SSL/TLS Setup

### Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d domain.com
sudo certbot renew --dry-run
```

### Strong SSL Config
```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
ssl_session_cache shared:SSL:10m;
```

---

## Security Headers

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Content-Security-Policy "default-src 'self';" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

---

## Docker Security

### Non-root Container
```dockerfile
USER www-data
```

### Secure Compose
```yaml
services:
  app:
    security_opt:
      - no-new-privileges:true
    read_only: true
```

### Image Scanning
```bash
docker scout cves <image>
trivy image <image>
```

---

## Security Audit Commands

```bash
# Open ports
sudo ss -tuln

# Failed logins
sudo grep "Failed password" /var/log/auth.log

# File permissions
find /var/www -perm 0777

# SSL check
openssl s_client -connect domain.com:443

# Nginx test
sudo nginx -t
```

---

## Production Checklist

| Check | Command/Action |
|-------|----------------|
| SSH hardened | Root login disabled, key-only |
| Firewall | UFW enabled, minimal ports |
| SSL | Valid cert, auto-renew |
| Headers | Security headers set |
| Updates | Auto-updates enabled |
| Fail2ban | Installed and active |
| APP_DEBUG | Set to false |
| Backups | Automated and tested |

---

## GitHub Actions Deploy

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/app
            php artisan down --retry=60
            git pull origin main
            composer install --no-dev
            php artisan migrate --force
            php artisan config:cache
            php artisan up
```
