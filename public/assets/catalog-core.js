(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.ExpoPulseCore=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const LIMITS={brand:100,event:100,name:140,sku:60,category:80,description:240,maxProducts:250};
  function clean(v,max){return String(v??'').trim().replace(/[\u0000-\u001F\u007F]/g,' ').replace(/\s+/g,' ').slice(0,max)}
  function digits(v){return String(v??'').replace(/\D/g,'')}
  function normalizeWhatsApp(v){const d=digits(v);if(!d)return '';if(d.length<10||d.length>15)throw new Error('WhatsApp inválido');return d}
  function sanitizeProduct(p){const out={name:clean(p?.name,LIMITS.name),sku:clean(p?.sku,LIMITS.sku),category:clean(p?.category,LIMITS.category),description:clean(p?.description,LIMITS.description)};if(!out.name) return null;return out}
  function sanitizeConfig(input){
    const brand=clean(input?.brand,LIMITS.brand);if(!brand)throw new Error('Marca obrigatória');
    const event=clean(input?.event,LIMITS.event);
    if(!Array.isArray(input?.products))throw new Error('Produtos obrigatórios');
    const products=input.products.slice(0,LIMITS.maxProducts).map(sanitizeProduct).filter(Boolean);
    if(!products.length)throw new Error('Catálogo sem produtos válidos');
    return {brand,event,whatsapp:normalizeWhatsApp(input?.whatsapp||''),demo:Boolean(input?.demo),products};
  }
  function parseItem(raw){
    const parts=String(raw??'').split('~');
    return sanitizeProduct({name:parts[0]||'',sku:parts[1]||'',category:parts[2]||'',description:parts.slice(3).join('~')||''});
  }
  function configFromQuery(search){
    const params=new URLSearchParams(search||'');
    const brand=clean(params.get('brand'),LIMITS.brand);
    const raws=params.getAll('item').slice(0,20);
    if(!brand||!raws.length)return null;
    const products=raws.map(parseItem).filter(Boolean);
    if(!products.length)return null;
    return sanitizeConfig({brand,event:params.get('event')||'',whatsapp:'',demo:true,products});
  }
  function buildMessage(cfg,p){
    const c=sanitizeConfig(cfg);const product=sanitizeProduct(p);if(!product)throw new Error('Produto inválido');
    const sku=product.sku?` (${product.sku})`:'';
    return `Olá! Vi ${product.name}${sku} no estande da ${c.brand}${c.event?` durante ${c.event}`:''} e quero saber mais.`;
  }
  function buildWhatsAppUrl(cfg,p){const c=sanitizeConfig(cfg);if(!c.whatsapp)throw new Error('WhatsApp não configurado');return `https://wa.me/${c.whatsapp}?text=${encodeURIComponent(buildMessage(c,p))}`}
  function fold(v){return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR')}
  function searchProducts(products,query){const t=fold(String(query??'').trim());if(!t)return [...products];return products.filter(p=>fold([p.sku,p.name,p.category,p.description].join(' ')).includes(t))}
  return {LIMITS,normalizeWhatsApp,sanitizeProduct,sanitizeConfig,parseItem,configFromQuery,buildMessage,buildWhatsAppUrl,searchProducts};
});
