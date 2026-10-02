// +54 9 261 485-9172. wa.me pide el número sin +, sin 0 y sin el 15: 549 + área + abonado.
const NUMERO = '5492614859172';

export const WHATSAPP_VISIBLE = '261 485-9172';

export const whatsapp = (texto: string) => `https://wa.me/${NUMERO}?text=${encodeURIComponent(texto)}`;

export const DEMO_WSP = whatsapp('Hola, quiero ver una demo del sistema para mi playa y probar un ejemplo con mis tarifas.');
export const CONSULTA_WSP = whatsapp('Hola, vi la página del sistema para playas de estacionamiento y quiero saber más.');
