# Ícones PWA Necessários

Para que o PWA funcione corretamente, você precisa criar os seguintes ícones e colocá-los na pasta `public/`:

## Ícones Obrigatórios

1. **pwa-192x192.png** - 192x192 pixels
   - Ícone para dispositivos Android
   - Deve ser quadrado
   - Fundo transparente ou sólido

2. **pwa-512x512.png** - 512x512 pixels
   - Ícone para splash screen e instalação
   - Deve ser quadrado
   - Fundo transparente ou sólido

## Recomendações

- Use formato PNG com transparência
- Mantenha elementos importantes no centro (safe area)
- Para ícones maskable, deixe uma margem de segurança de ~20%
- Use cores que representem a marca "Participa"
- Considere usar a cor primária #1976d2

## Ferramentas para Criar Ícones

- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Favicon.io](https://favicon.io/)

## Exemplo de Comando

Se você tiver uma imagem base (logo.png), pode usar:

```bash
# Instalar pwa-asset-generator
npm install -g pwa-asset-generator

# Gerar ícones
pwa-asset-generator logo.png public/ --icon-only --favicon
```

Ou use ferramentas online como o [PWA Builder](https://www.pwabuilder.com/imageGenerator) para gerar todos os ícones necessários.

