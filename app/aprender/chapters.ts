export type Chapter = { title: string; section: string; start: number; duration: number; narration: string };
export const chapters: Readonly<Record<string, readonly Chapter[]>> = {
  "01": [
    {
      "title": "Entradas y salidas en un solo lugar",
      "section": "El mostrador",
      "start": 5.4,
      "duration": 15.168,
      "narration": "Esta es la pantalla de operación. Desde aquí puedes registrar ingresos, buscar los vehículos que están dentro y cobrar las salidas. El contador y los colores te ayudan a revisar el estado del estacionamiento."
    },
    {
      "title": "Primero, identifica el vehículo",
      "section": "Registrar entrada",
      "start": 20.568,
      "duration": 16.104,
      "narration": "Para recibir un vehículo, selecciona Registrar entrada. Escribe la patente o busca por apellido o teléfono. Si el cliente ya vino antes, el sistema puede recuperar sus datos para evitar que los vuelvas a cargar."
    },
    {
      "title": "Escribe y revisa la patente",
      "section": "Buscar o escribir",
      "start": 36.672,
      "duration": 16.824,
      "narration": "En este ejemplo usamos la patente de demostración ZZ731ZX. Revisa las letras y los números antes de continuar. Si aparece una coincidencia anterior, comprueba que corresponda al mismo vehículo."
    },
    {
      "title": "Selecciona el tipo de vehículo",
      "section": "Tipo de vehículo",
      "start": 53.496,
      "duration": 15.096,
      "narration": "Selecciona el tipo de vehículo que va a ingresar. En esta demostración elegimos Auto. Esta opción determina las tarifas que se usarán al calcular la salida, así que conviene revisarla antes de registrar."
    },
    {
      "title": "Datos del cliente y modelo: opcionales",
      "section": "Datos del cliente",
      "start": 68.592,
      "duration": 16.896,
      "narration": "El apellido, el teléfono y el modelo del vehículo son opcionales. Puedes abrir esta sección si quieres agregarlos. Ayudan a reconocer al cliente en futuras visitas, pero puedes registrar el ingreso sin completar estos campos."
    },
    {
      "title": "Completa sólo lo que necesites",
      "section": "Completar datos",
      "start": 85.488,
      "duration": 15.576,
      "narration": "En el ejemplo agregamos el apellido Demostración y el modelo Fiat Cronos. Puedes completar sólo el dato que necesites o dejar toda la sección vacía. Antes de continuar, revisa la patente y el tipo de vehículo."
    },
    {
      "title": "Toma una foto de la patente",
      "section": "Foto desde el celular",
      "start": 101.064,
      "duration": 16.92,
      "narration": "Desde el celular, selecciona Escanear. Se abrirá la cámara del teléfono. Encuadra el auto con la patente bien visible, toma una foto y elige Usar foto. El sistema recibe la imagen para reconocer el vehículo."
    },
    {
      "title": "Revisa los datos reconocidos",
      "section": "Reconocimiento de la foto",
      "start": 117.984,
      "duration": 15.624,
      "narration": "A partir de la foto, el sistema lee la patente y puede sugerir el tipo y el modelo. En este caso completa la patente, Auto y Fiat Cronos. Revisa los datos reconocidos antes de confirmar el ingreso."
    },
    {
      "title": "Revisa y registra una sola vez",
      "section": "Confirmar",
      "start": 133.608,
      "duration": 17.496,
      "narration": "Ahora revisamos los datos en la computadora. Confirma la patente, el tipo y los datos adicionales. Selecciona Registrar entrada una sola vez. El sistema guarda el ingreso, la hora y el usuario responsable."
    },
    {
      "title": "El comprobante confirma el ingreso",
      "section": "Entrada registrada",
      "start": 151.104,
      "duration": 15.552,
      "narration": "El ingreso ya está registrado. Esta ventana muestra el comprobante y las formas disponibles para entregarlo. Si cierras la ventana, el ingreso se conserva: el vehículo ya aparece dentro del estacionamiento."
    },
    {
      "title": "Abre el comprobante completo",
      "section": "Ver el comprobante",
      "start": 166.656,
      "duration": 15.672,
      "narration": "Selecciona la ficha de la patente para abrir el comprobante completo. Revisa el nombre del estacionamiento, la patente, la fecha, la hora y el operador. El documento conserva los datos de este ingreso."
    },
    {
      "title": "El QR abre el comprobante",
      "section": "Compartir",
      "start": 182.328,
      "duration": 15.6,
      "narration": "El cliente puede escanear este código QR para abrir su comprobante. También puedes copiar el enlace o abrirlo en el navegador. Este código permite consultar el documento: no es un código para realizar un pago."
    },
    {
      "title": "QR, impresión y descarga",
      "section": "Canales de entrega",
      "start": 197.928,
      "duration": 16.92,
      "narration": "La configuración del estacionamiento determina las formas de entrega. Puede habilitar el código QR y la impresión térmica de cincuenta y ocho u ochenta milímetros. Desde el comprobante público también puedes descargar una imagen o un PDF."
    },
    {
      "title": "El cliente lo abre desde su enlace",
      "section": "Comprobante digital",
      "start": 214.848,
      "duration": 14.664,
      "narration": "Así ve el cliente su comprobante digital. El documento muestra la patente y los datos del ingreso. Puede guardarlo y consultarlo después, sin iniciar sesión en el sistema de administración."
    },
    {
      "title": "Guarda el PDF o una imagen",
      "section": "Descargar o imprimir",
      "start": 229.512,
      "duration": 16.272,
      "narration": "Desde el comprobante puedes descargar un PDF, guardar una imagen o compartirla. Para imprimir, selecciona la impresora y el tamaño de papel correspondiente. Volver a descargar este documento no registra un ingreso nuevo."
    },
    {
      "title": "Recupera un comprobante anterior",
      "section": "Historial",
      "start": 245.784,
      "duration": 14.904,
      "narration": "Si necesitas entregar el comprobante otra vez, abre Comprobantes desde Operación. El historial conserva los documentos del día. Puedes buscar la patente y recuperar el comprobante sin repetir el ingreso."
    },
    {
      "title": "Filtra por patente o apellido",
      "section": "Encontrar el documento",
      "start": 260.688,
      "duration": 14.592,
      "narration": "Escribe la patente de la demostración para filtrar la lista. El resultado muestra el ingreso y el usuario que lo registró. Si la estadía ya terminó, también puedes abrir el comprobante de salida."
    },
    {
      "title": "Consulta una fecha anterior",
      "section": "Consultar otra fecha",
      "start": 275.28,
      "duration": 14.304,
      "narration": "El calendario permite consultar otra fecha. Selecciona el día del ingreso o de la salida y combínalo con la búsqueda por patente. Puedes recuperar el documento sin volver a crear el registro."
    },
    {
      "title": "Abre y comparte el comprobante",
      "section": "Volver a entregar",
      "start": 289.584,
      "duration": 15.744,
      "narration": "Aquí abrimos de nuevo el comprobante de entrada. Puedes copiar el enlace, mostrar el código QR o descargar el documento cuando lo necesites. Compartirlo otra vez no agrega un vehículo ni genera un cobro nuevo."
    }
  ],
  "02": [
    {
      "title": "Cada operador trabaja con su turno",
      "section": "Configuración de turnos",
      "start": 5.4,
      "duration": 17.856,
      "narration": "Esta guía recorre la configuración, la apertura, el cobro y el cierre. Un turno identifica al operador; la caja representa el cajón de efectivo. Son dos cosas distintas, especialmente cuando varias personas comparten la misma caja."
    },
    {
      "title": "Activar turnos de caja",
      "section": "Paso 1 · Activar",
      "start": 23.256,
      "duration": 19.488,
      "narration": "Desde Administración, Configuración, Operación, abre Turnos de caja. Activados, cada operador abre su turno para trabajar con efectivo. Apagados, puedes cobrar sin turno y el historial anterior se conserva. Continuar guarda este paso."
    },
    {
      "title": "Una caja con relevos",
      "section": "Paso 2 · Modo",
      "start": 42.744,
      "duration": 18.048,
      "narration": "Con turnos múltiples apagado, la caja principal funciona por relevos: un operador termina, cuenta el efectivo y deja el fondo. El siguiente recibe esa misma caja. Antes de cambiar el modo o desactivar turnos debes cerrar los que sigan abiertos."
    },
    {
      "title": "Compartir caja no duplica el fondo",
      "section": "Paso 2 · Modo",
      "start": 60.792,
      "duration": 18.432,
      "narration": "Turnos múltiples permite trabajar al mismo tiempo. Usa una caja por cada cajón físico; si dos personas comparten el mismo cajón, deben elegir la misma caja. Cada una conserva su turno y el último operador hace el arqueo del efectivo compartido."
    },
    {
      "title": "Nombre de caja y fondo objetivo",
      "section": "Paso 3 · Cajas",
      "start": 79.224,
      "duration": 17.928,
      "narration": "En Cajas identificas el cajón y su fondo objetivo. Ese fondo es una referencia de cambio que se intenta conservar; no es una venta. Guardar caja aplica sus datos. Con turnos múltiples también puedes agregar y desactivar cajas."
    },
    {
      "title": "El sueldo se configura por usuario",
      "section": "Paso 4 · Sueldo",
      "start": 97.152,
      "duration": 19.104,
      "narration": "El retiro automático de sueldo es opcional y se configura por usuario. Activa la opción general, elige quién retira e indica su importe por jornada. Sin seleccionar un usuario no se retira sueldo para esa persona. Los cambios rigen para jornadas nuevas."
    },
    {
      "title": "Seleccionar persona e importe",
      "section": "Sueldo por jornada",
      "start": 116.256,
      "duration": 19.32,
      "narration": "Aquí se elige la persona y se carga el importe. El turno abierto conserva el sueldo previsto al comenzar su jornada. El sistema controla el efectivo disponible y el fondo al cerrar; si no alcanza, informa la situación. Este ejemplo se muestra sin guardar."
    },
    {
      "title": "Medianoche no cierra tu turno",
      "section": "Continuidad de la jornada",
      "start": 135.576,
      "duration": 18.528,
      "narration": "El corte de medianoche separa las operaciones por fecha para la planilla. La caja puede seguir abierta y el operador continuar trabajando. Ese corte no retira el sueldo ni exige contar otra vez el cajón. El cierre de la jornada lo confirma el operador."
    },
    {
      "title": "Abrir mi turno",
      "section": "Comenzar a trabajar",
      "start": 154.104,
      "duration": 17.064,
      "narration": "De vuelta en el mostrador, selecciona Abrir mi turno. El turno queda a nombre del usuario conectado: no se escribe otro nombre. Antes de cobrar en efectivo, comprueba en qué caja trabajarás y cuenta físicamente lo que recibes."
    },
    {
      "title": "Revisar el relevo anterior",
      "section": "Recibir el fondo",
      "start": 171.168,
      "duration": 16.296,
      "narration": "La apertura muestra quién dejó la caja, cuándo cerró, cuánto efectivo quedó y los vehículos que había. Compara ese importe con el dinero físico que tienes delante. El fondo recibido no se suma como ingreso por estacionamiento."
    },
    {
      "title": "Declarar lo que recibiste",
      "section": "Conteo inicial",
      "start": 187.464,
      "duration": 18.936,
      "narration": "El importe comienza vacío para que lo confirmes. Recibí todo completa el efectivo esperado; Sin efectivo recibido declara cero. También puedes editarlo. Si recibes un importe diferente al cierre anterior, explica la diferencia antes de abrir."
    },
    {
      "title": "Agregar cambio es opcional",
      "section": "Cambio adicional",
      "start": 206.4,
      "duration": 16.92,
      "narration": "Despliega Agregar cambio solamente si incorporas dinero de afuera al cajón. Se suma al fondo, pero no es una venta. Si te unes a una caja compartida que ya está abierta, no vuelvas a declarar el fondo que otro operador ya recibió."
    },
    {
      "title": "Abrir la caja una sola vez",
      "section": "Confirmar apertura",
      "start": 223.32,
      "duration": 17.208,
      "narration": "Después de contar y revisar, confirma Abrir caja y mi turno. La operación se registra una sola vez. En esta demostración los dos dispositivos muestran la misma cuenta, así que abrimos desde la computadora y actualizamos el celular."
    },
    {
      "title": "Efectivo esperado y operaciones",
      "section": "Turno abierto",
      "start": 240.528,
      "duration": 17.856,
      "narration": "Mi turno muestra el efectivo esperado de toda la caja y el resumen de tu usuario. El efectivo incluye fondo, cobros y movimientos del cajón; no equivale a tu recaudación. En una caja compartida intervienen las operaciones de todos sus operadores."
    },
    {
      "title": "Buscar por patente o apellido",
      "section": "Buscar la estadía",
      "start": 258.384,
      "duration": 17.64,
      "narration": "En la computadora usa Buscar un vehículo. En el celular abre Cobrar salida para ver la lista. Escribe la patente o el apellido y revisa la coincidencia. Los avisos de estadías largas ayudan a comprobar qué vehículos continúan dentro."
    },
    {
      "title": "Abrir la estadía correcta",
      "section": "Seleccionar el vehículo",
      "start": 276.024,
      "duration": 17.136,
      "narration": "Selecciona la patente que coincide con el vehículo. El panel muestra la entrada, el tiempo transcurrido y el saldo a cobrar. Abrirlo todavía no cobra ni registra la salida. Comprueba siempre que la estadía sea la correcta."
    },
    {
      "title": "Revisar tiempo, total y saldo",
      "section": "Comprobar el saldo",
      "start": 293.16,
      "duration": 18.48,
      "narration": "El saldo considera el importe calculado y los anticipos ya registrados. Usa Ver cálculo para revisar las tarifas y las reglas aplicadas. La estadía puede conservar los precios fijados al entrar; no reemplaces el resultado del sistema por una cuenta manual."
    },
    {
      "title": "Corregir los datos antes de cobrar",
      "section": "Correcciones autorizadas",
      "start": 311.64,
      "duration": 17.472,
      "narration": "Si detectas un error, Corregir permite revisar los datos de la estadía según tus permisos. Comprueba patente, tipo y entrada, y explica los cambios cuando se solicite. Corregir una entrada no es lo mismo que borrar un cobro ya realizado."
    },
    {
      "title": "Cuando el vehículo se fue antes",
      "section": "Salida anterior",
      "start": 329.112,
      "duration": 17.304,
      "narration": "Se fue antes permite elegir la tarifa que correspondía a una salida anterior. Revisa las alternativas y el motivo antes de confirmar. Esa confirmación cobra y registra la salida; no uses esta opción para ocultar una diferencia de caja."
    },
    {
      "title": "Registrar un anticipo o una duración",
      "section": "Anticipos",
      "start": 346.416,
      "duration": 17.664,
      "narration": "Anticipo abre las opciones para registrar dinero recibido antes de la salida o avisar una duración. Un anticipo es dinero ya cobrado: reduce el saldo pendiente. Revisa el medio de pago y confirma solamente el importe que realmente recibiste."
    },
    {
      "title": "Descuento y motivo quedan registrados",
      "section": "Descuentos",
      "start": 364.08,
      "duration": 18.816,
      "narration": "Descuento permite ajustar el cobro cuando corresponde y según los permisos del usuario. Revisa el importe y escribe el motivo solicitado. La cortesía deja el saldo en cero, pero debe quedar justificada. Aquí mostramos las opciones sin aplicar una reducción."
    },
    {
      "title": "Elegir cómo paga este cliente",
      "section": "Medios de pago",
      "start": 382.896,
      "duration": 19.32,
      "narration": "Elige un medio para este saldo. Efectivo y transferencia manual los confirma el operador después de verificarlos. QR y Al alias consultan Mercado Pago. Efectivo y otro medio permite repartir el mismo pago; no son cobros independientes que debas repetir."
    },
    {
      "title": "Calcular el vuelto sin confirmar",
      "section": "Efectivo",
      "start": 402.216,
      "duration": 19.08,
      "narration": "En Efectivo puedes elegir un importe o usar Otro para indicar cuánto entrega el cliente. El sistema muestra el vuelto. Esto es una ayuda de cálculo: primero cuenta el dinero, verifica el saldo y después confirma. El turno debe estar abierto si está habilitado."
    },
    {
      "title": "Verificar antes de registrar",
      "section": "Transferencia manual",
      "start": 421.296,
      "duration": 18.144,
      "narration": "Transferencia registra un pago que verificaste por tu cuenta. Revisa que el dinero esté acreditado antes de confirmar. Esta opción no consulta automáticamente tu banco; se diferencia de Al alias, que busca la acreditación en la cuenta de Mercado Pago vinculada."
    },
    {
      "title": "El QR espera la acreditación",
      "section": "Cobro con QR",
      "start": 439.44,
      "duration": 18.888,
      "narration": "QR y celular prepara un cobro por el saldo pendiente. El cliente escanea el código y paga desde una aplicación compatible. La salida se registra cuando la acreditación confirmada cubre el saldo. No declares además una transferencia manual por ese mismo pago."
    },
    {
      "title": "El importe exacto permite identificar el pago",
      "section": "Cobro al alias",
      "start": 458.328,
      "duration": 20.16,
      "narration": "Al alias verifica transferencias en la cuenta vinculada cuando la función está habilitada. El cliente debe transferir el importe exacto indicado. Una captura del comprobante no reemplaza la acreditación. Si hay coincidencias para revisar o queda saldo, sigue las indicaciones del sistema."
    },
    {
      "title": "Una parte en efectivo y el resto por otro medio",
      "section": "Pago combinado",
      "start": 478.488,
      "duration": 19.608,
      "narration": "En Efectivo y otro medio escribe la parte recibida en efectivo; el sistema calcula el resto. Selecciona cómo paga esa diferencia. Si continúas con QR o alias, la parte en efectivo puede quedar registrada aunque el resto siga pendiente: evita cargarla nuevamente."
    },
    {
      "title": "Confirmar una sola salida",
      "section": "Confirmación del cobro",
      "start": 498.096,
      "duration": 18.624,
      "narration": "Para terminar el ejemplo elegimos efectivo. Después de recibirlo y revisar el saldo, selecciona Cobrar y registrar salida una sola vez. El sistema vuelve a validar el importe; si cambió en otro equipo, actualiza el resumen antes de aceptar la confirmación."
    },
    {
      "title": "El comprobante confirma el resultado",
      "section": "Salida registrada",
      "start": 516.72,
      "duration": 17.976,
      "narration": "La salida queda registrada y se muestra su comprobante. Ese es el resultado que debes revisar: patente, fecha, hora, usuario y pago. En el celular recuperamos el mismo comprobante; consultarlo otra vez no vuelve a cobrar la estadía."
    },
    {
      "title": "Revisar el documento completo",
      "section": "Entregar el comprobante",
      "start": 534.696,
      "duration": 16.776,
      "narration": "Abre la ficha para desplegar el comprobante completo. Puedes entregarlo con las opciones habilitadas en la playa, mostrar el código QR o abrir el enlace público para descargarlo. La salida ya está registrada aunque cierres esta ventana."
    },
    {
      "title": "Comprobar que el vehículo ya salió",
      "section": "Control del mostrador",
      "start": 551.472,
      "duration": 17.64,
      "narration": "Al volver al mostrador, la patente ya no aparece entre los vehículos dentro y el contador se actualiza. El movimiento y el comprobante quedan en el historial. Si necesitas reenviarlo, recupéralo desde Comprobantes en lugar de crear otro ingreso o cobro."
    },
    {
      "title": "El cobro en efectivo actualiza la caja",
      "section": "Resumen actualizado",
      "start": 569.112,
      "duration": 17.112,
      "narration": "El resumen del turno ahora incluye este cobro en efectivo. El esperado del cajón suma el fondo recibido y los movimientos. Las transferencias y Mercado Pago se informan por separado; no aumentan el dinero físico que vas a contar al cerrar."
    },
    {
      "title": "El último operador cuenta toda la caja",
      "section": "Finalizar la jornada",
      "start": 586.224,
      "duration": 17.28,
      "narration": "Al terminar abre Mi turno y elige cerrar. Si otros operadores siguen en la misma caja, puedes cerrar sólo tu turno. Si eres el último, debes contar todo el efectivo del cajón, incluidos el fondo y los movimientos de los demás."
    },
    {
      "title": "Comprobar las estadías pendientes",
      "section": "Revisar los vehículos",
      "start": 603.504,
      "duration": 19.56,
      "narration": "Antes de cerrar, revisa los vehículos que el sistema pide confirmar. Si siguen en la playa, indícalo; si salieron, revisa el cobro que corresponde. Este repaso evita dejar estadías abiertas por olvido. No confirmes una presencia sin haberla comprobado."
    },
    {
      "title": "Contar el dinero real",
      "section": "Arqueo del efectivo",
      "start": 623.064,
      "duration": 17.328,
      "narration": "Escribe cuánto efectivo contaste o usa Conté todo si coincide. Conté menos lleva al campo para que escribas el valor real; no inventa una diferencia. Si falta o sobra dinero, el sistema solicita el motivo antes de confirmar el cierre."
    },
    {
      "title": "Explicar faltantes o sobrantes",
      "section": "Diferencias de caja",
      "start": 640.392,
      "duration": 18.528,
      "narration": "Aquí mostramos una diferencia de ejemplo, sin confirmarla. El motivo debe explicar lo ocurrido y queda en el historial. No ajustes el conteo para ocultarla: registra el efectivo real. Después volvemos al importe contado en esta demostración."
    },
    {
      "title": "Elegir cuánto dejas en el cajón",
      "section": "Fondo del siguiente turno",
      "start": 658.92,
      "duration": 19.392,
      "narration": "El fondo sugerido es una referencia. Puedes dejar más, menos o cero, hasta el efectivo disponible después del sueldo que corresponda. Usar sugerido recupera esa referencia; Cambiar importe permite escribir tu elección. La decisión vale para este cierre."
    },
    {
      "title": "Dejar todo es una opción",
      "section": "Conservar el efectivo",
      "start": 678.312,
      "duration": 18.552,
      "narration": "Dejar todo conserva el efectivo disponible en la caja y reduce el retiro de recaudación. No cambia las ventas del turno. Si corriges el conteo y tu elección deja de ser posible, debes ajustarla antes de cerrar. Revisa siempre el resumen final."
    },
    {
      "title": "Separar fondo, sueldo y recaudación",
      "section": "Retiro y traspaso",
      "start": 696.864,
      "duration": 17.448,
      "narration": "El resumen explica cuánto queda para el siguiente turno y cuánto se retira como recaudación. Si hay sueldo previsto y alcanza el efectivo, se informa por separado y puedes elegir no retirarlo. No sumes el sueldo otra vez al retiro de recaudación."
    },
    {
      "title": "Dejar una explicación útil",
      "section": "Nota del turno",
      "start": 714.312,
      "duration": 17.04,
      "narration": "La nota del turno es opcional cuando el conteo coincide; si hay una diferencia, el motivo es obligatorio. La explicación se conserva en el historial y puede publicarse en Avisos para el equipo. Comprueba lo que vas a comunicar antes de confirmar."
    },
    {
      "title": "Si no alcanza, el sistema lo informa",
      "section": "Sueldo y fondo protegido",
      "start": 731.352,
      "duration": 17.112,
      "narration": "En este ejemplo el sueldo previsto supera el efectivo que queda después de preservar el fondo. El sistema avisa que no lo descontará y deja la alerta en el historial. No modifiques el conteo para forzarlo: revisa la configuración y el dinero real."
    },
    {
      "title": "Confirmar la revisión de los vehículos",
      "section": "Repaso antes del cierre",
      "start": 748.464,
      "duration": 18.096,
      "narration": "Después de comprobar los vehículos, marca los que siguen dentro. Siguen todos permite confirmar el grupo cuando realmente lo revisaste. Este control no cobra ni registra la salida de esos autos; si alguno ya salió, vuelve a su estadía para resolverlo."
    },
    {
      "title": "Confirmar el cierre del turno y la caja",
      "section": "Última comprobación",
      "start": 766.56,
      "duration": 18.6,
      "narration": "Revisa el conteo, el fondo para el siguiente operador, el retiro y el estado del sueldo. Confirmar cierre de turno y caja termina esta jornada y conserva el registro. En una caja compartida, cerrar sólo tu turno mantiene la caja abierta para los demás."
    },
    {
      "title": "La jornada queda documentada",
      "section": "Historial del cierre",
      "start": 785.16,
      "duration": 17.088,
      "narration": "El historial conserva quién cerró, cuándo lo hizo, cuánto contó y cuánto dejó. Puedes filtrar por período o usuario y desplegar el registro. El cierre documenta la jornada; consultar su resumen después no vuelve a retirar efectivo."
    },
    {
      "title": "Revisar contado, fondo y retiro",
      "section": "Detalle del cierre",
      "start": 802.248,
      "duration": 18.288,
      "narration": "Despliega el cierre para comparar el efectivo esperado con el contado, el fondo que queda y los retiros. El registro conserva la jornada y cualquier advertencia de sueldo o diferencia. Usa estos datos para revisar lo ocurrido, sin reemplazar el conteo físico."
    },
    {
      "title": "Un corte de medianoche no es un relevo",
      "section": "Cortes diarios",
      "start": 820.536,
      "duration": 17.064,
      "narration": "Los registros Corte de las cero horas separan la actividad por fecha. Indican que la jornada continúa y no equivalen a un operador entregando la caja. Distinguirlos evita sumar el fondo o el sueldo varias veces cuando consultas varios días."
    },
    {
      "title": "El siguiente turno recibe el fondo dejado",
      "section": "Jornada terminada",
      "start": 837.6,
      "duration": 17.784,
      "narration": "La caja quedó cerrada y el siguiente operador podrá abrir su turno recibiendo el fondo declarado. El cierre no ocurre por cerrar la pestaña ni por llegar a medianoche. Revisa los vehículos, cuenta el efectivo y confirma la entrega para terminar la jornada."
    }
  ],
  "03": [
    {
      "title": "Consultar, probar y aplicar son acciones distintas",
      "section": "Tarifas vigentes",
      "start": 5.4,
      "duration": 18.864,
      "narration": "Tarifas muestra los precios vigentes, permite probar cuánto se cobraría y ofrece un editor para preparar cambios. Consultar o simular no cobra ni modifica una estadía. Aplicar tarifas es la confirmación que publica la nueva configuración para los ingresos que correspondan."
    },
    {
      "title": "Cada vehículo tiene sus propios precios",
      "section": "Tipo de vehículo",
      "start": 24.264,
      "duration": 19.32,
      "narration": "Selecciona el tipo de vehículo para consultar su lista. Auto y Camioneta pueden tener importes distintos. Si la playa habilita otros tipos, también necesitan precios. Comprueba siempre el vehículo elegido antes de interpretar un resultado o editar una tarifa."
    },
    {
      "title": "Cambiar la vista entre día y noche",
      "section": "Precios de noche",
      "start": 43.584,
      "duration": 19.896,
      "narration": "El control del sol y la luna cambia los precios que estás viendo. El encabezado identifica el horario y el tipo de vehículo. No activa una tarifa nueva: sólo alterna la consulta de la configuración vigente. Si no se cobra distinto de noche, se usa una única lista."
    },
    {
      "title": "Leer Hasta y Después de la última duración",
      "section": "Duraciones y cobro posterior",
      "start": 63.48,
      "duration": 20.88,
      "narration": "Hasta indica el importe de una duración publicada. Después de la última duración, el sistema puede agregar cobros por períodos adicionales. Según la modalidad, también puede combinar duraciones menores. Usa el simulador para comprobar el resultado completo y no sumar filas a mano."
    },
    {
      "title": "Probar sin registrar ingresos ni cobros",
      "section": "Simulador",
      "start": 84.36,
      "duration": 18.048,
      "narration": "El simulador usa el vehículo, la hora de entrada y el tiempo de permanencia. Puedes cargar horas y minutos o elegir uno de los ejemplos. El cálculo utiliza las reglas del sistema; probar una estadía no registra un vehículo ni crea un movimiento de caja."
    },
    {
      "title": "Elegir horas y minutos",
      "section": "Permanencia de ejemplo",
      "start": 102.408,
      "duration": 18.504,
      "narration": "Seleccionamos una permanencia de ejemplo. La hora de entrada permite probar cruces entre día y noche y la salida puede quedar en otro día. Modifica una variable por vez para entender por qué cambia el importe: vehículo, duración, horario o tolerancia."
    },
    {
      "title": "Calcular y revisar el detalle",
      "section": "Resultado del ejemplo",
      "start": 120.912,
      "duration": 18.096,
      "narration": "Calcular ejemplo devuelve el importe y su explicación. Revisa las duraciones y reglas aplicadas antes de usar ese precio como referencia. El simulador y el cobro real comparten el cálculo del sistema; esta prueba sirve para entenderlo sin generar una operación."
    },
    {
      "title": "El simulador tiene su propio vehículo",
      "section": "Variables del simulador",
      "start": 139.008,
      "duration": 16.272,
      "narration": "El vehículo del simulador se selecciona dentro de la prueba. No supongas que es el mismo que estás consultando en la lista superior. Aquí elegimos Camioneta y calculamos otra vez con la misma permanencia para comparar correctamente."
    },
    {
      "title": "Desplegar cómo se llegó al importe",
      "section": "Explicación del cálculo",
      "start": 155.28,
      "duration": 17.712,
      "narration": "Ver cómo se calculó despliega el detalle del ejemplo. Revisa las duraciones, los períodos adicionales y el criterio horario. Si un resultado te sorprende, vuelve a estas variables y a las reglas vigentes antes de cambiar precios o confirmar un cobro real."
    },
    {
      "title": "Preparar cambios sin aplicarlos",
      "section": "Editor actual · Paso 1",
      "start": 172.992,
      "duration": 18.648,
      "narration": "Editar tarifas abre el editor actual de tres pasos: Cobro, Precios y Horarios o Tolerancia. Los cambios permanecen como borrador hasta su confirmación. Puedes revisarlos y probarlos antes de aplicar. Esta grabación conserva la tarifa publicada."
    },
    {
      "title": "Lista de precios o períodos iniciados",
      "section": "Modalidad de cobro",
      "start": 191.64,
      "duration": 17.376,
      "narration": "Con una lista de precios defines importes para duraciones concretas y qué ocurre después. Por hora o fracción cobra el mismo importe por cada período que empieza. Elige la modalidad que represente cómo trabaja tu playa, antes de cargar los valores."
    },
    {
      "title": "Cada período que empieza se cobra completo",
      "section": "Por hora o fracción",
      "start": 209.016,
      "duration": 19.872,
      "narration": "Seleccionamos Por hora o fracción para mostrar sus campos. Puedes definir la duración del período, por ejemplo una hora o una fracción menor. Cada período que comienza se cobra completo según la configuración y su tolerancia. No equivale necesariamente a cobrar por minuto."
    },
    {
      "title": "Duración del período y precio por vehículo",
      "section": "Paso 2 · Precios",
      "start": 228.888,
      "duration": 19.344,
      "narration": "En Precios se define la duración de cada período y el importe de cada vehículo. Si hay cobro distinto de noche, aparecen valores de día y de noche. Revisa ambos y completa los tipos habilitados. Los valores de este borrador todavía no están publicados."
    },
    {
      "title": "Completar día y noche para Auto",
      "section": "Valores del borrador",
      "start": 248.232,
      "duration": 19.2,
      "narration": "Cargamos importes de ejemplo para Auto. Revisa si estás editando día o noche y conserva una lógica coherente entre las opciones. El rótulo Borrador recuerda que estos valores todavía no se cobran. Para publicarlos faltaría revisar y confirmar la aplicación."
    },
    {
      "title": "Completar los vehículos habilitados",
      "section": "Otros tipos de vehículo",
      "start": 267.432,
      "duration": 17.976,
      "narration": "También cargamos los precios de Camioneta. Cada tipo habilitado necesita sus valores en esta modalidad. Agregar o administrar vehículos lleva a la configuración de los tipos que recibe la playa; habilitar un tipo no equivale a haberle definido todos sus precios."
    },
    {
      "title": "Revisar antes de quitar el precio nocturno",
      "section": "Una sola lista durante el día",
      "start": 285.408,
      "duration": 17.952,
      "narration": "Si apagas Cobro distinto de noche, el editor pide confirmar que se usarán los precios de día durante todo el día. Esta decisión modifica el borrador, no publica automáticamente la tarifa. En la demostración cancelamos y mantenemos los valores nocturnos."
    },
    {
      "title": "Definir cuándo comienza cada horario",
      "section": "Paso 3 · Horarios",
      "start": 303.36,
      "duration": 18.84,
      "narration": "En Horarios se indica desde qué hora y hasta qué hora se considera día. El resto corresponde a noche. Revisa el criterio de cambio cuando una estadía cruza de un horario al otro. No basta con cargar dos precios: también debes comprender cuándo se aplica cada uno."
    },
    {
      "title": "Minutos antes de pasar al siguiente cobro",
      "section": "Tolerancia",
      "start": 322.2,
      "duration": 17.136,
      "narration": "La tolerancia permite pasarse una cantidad de minutos antes de avanzar a la siguiente duración o período. No es un descuento fijo de dinero. Aquí probamos diez minutos en el borrador; comprueba su efecto con ejemplos cercanos al límite antes de aplicarlo."
    },
    {
      "title": "Usar el precio de la entrada o de la salida",
      "section": "Cruce de horarios",
      "start": 339.336,
      "duration": 17.472,
      "narration": "El criterio de cruce decide qué ocurre si una estadía pasa de día a noche, o al revés. Precio de entrada usa el horario al ingresar; precio de salida usa el horario al retirarse. Revisa esta elección junto con tus importes de día y noche."
    },
    {
      "title": "Calcular por tramos de día y de noche",
      "section": "Separar horarios",
      "start": 356.808,
      "duration": 16.944,
      "narration": "Separar el tiempo de día y de noche distribuye la permanencia entre los horarios que cruzó. No equivale a aplicar un único precio a toda la estadía. Prueba entradas cercanas al cambio y revisa el desglose para decidir qué comportamiento necesitas."
    },
    {
      "title": "Revisar el alcance antes de aplicar",
      "section": "Vehículos que ya ingresaron",
      "start": 373.752,
      "duration": 19.752,
      "narration": "Sin marcar Aplicar también a los vehículos que están adentro, las estadías con tarifa fijada conservan sus precios. Marcarlo permite recalcularlas desde su entrada con la nueva tarifa; lo ya pagado se descuenta y un excedente puede requerir devolución. Revisa este alcance con especial cuidado."
    },
    {
      "title": "Probar antes de publicar los cambios",
      "section": "Prueba del borrador",
      "start": 393.504,
      "duration": 17.208,
      "narration": "Probar cuánto cobrarías abre el simulador del borrador. Puedes comparar tu propuesta con las tarifas vigentes usando el mismo vehículo y la misma permanencia. Esta prueba no aplica los cambios, no cobra ni modifica las estadías que están adentro."
    },
    {
      "title": "Calcular la propuesta y revisar la diferencia",
      "section": "Comparar configuraciones",
      "start": 410.712,
      "duration": 20.808,
      "narration": "Calculamos el ejemplo con el borrador preparado. Revisa el resultado y el detalle de cada configuración. Si no representa el cobro que quieres hacer, vuelve a los pasos anteriores. Una simulación correcta ayuda a decidir; todavía falta la aplicación final para publicar los precios."
    },
    {
      "title": "Volver a duraciones concretas",
      "section": "Lista de precios",
      "start": 431.52,
      "duration": 17.304,
      "narration": "Volvemos a Con una lista de precios para recorrer la otra modalidad. Aquí puedes definir un precio para treinta minutos, otro para una hora y otras duraciones. Los cambios de modalidad se mantienen en el borrador hasta que los apliques o los descartes."
    },
    {
      "title": "Hasta indica duración y precio total",
      "section": "Paso 2 · Duraciones",
      "start": 448.824,
      "duration": 19.296,
      "narration": "Cada fila combina Hasta con un precio total para esa duración. Revisa la unidad: minutos, horas o días. El valor no es el precio de un minuto, salvo que esa sea exactamente la duración elegida. Las duraciones se organizan para que puedas revisar la lista."
    },
    {
      "title": "Cambiar el importe de una fila",
      "section": "Editar una duración",
      "start": 468.12,
      "duration": 18.456,
      "narration": "Editamos el precio de una duración en el borrador. Revisa siempre qué vehículo, duración y horario pertenecen a esa fila. El precio de treinta minutos no es el de una hora. Las unidades y el alcance del horario evitan modificar un valor equivocado."
    },
    {
      "title": "Todo el día o un horario específico",
      "section": "Alcance de cada fila",
      "start": 486.576,
      "duration": 18.24,
      "narration": "Una fila puede aplicarse todo el día o sólo en un horario. Para la misma duración, los precios específicos de día o noche reemplazan al general de todo el día. Revisa la combinación completa para evitar contradicciones y comprueba el resultado con el simulador."
    },
    {
      "title": "Agregar una fila y completar sus datos",
      "section": "Agregar duraciones",
      "start": 504.816,
      "duration": 19.272,
      "narration": "Agregar duración crea otra fila para ese vehículo. Completa tiempo, unidad, importe y horario. El botón de copiar puede reutilizar un precio como punto de partida; después revisa los datos de la nueva fila. Un borrador incompleto no debe aplicarse."
    },
    {
      "title": "Definir qué ocurre después de la última duración",
      "section": "Paso 2 · Más tiempo",
      "start": 524.088,
      "duration": 17.544,
      "narration": "La segunda parte de Precios define qué pasa si el vehículo permanece más tiempo. No basta con cargar la última duración de la lista. Revisa el cobro posterior de cada vehículo y de cada horario que uses para que las estadías largas tengan una regla clara."
    },
    {
      "title": "Revisar período, importe y criterio",
      "section": "Cobro posterior",
      "start": 541.632,
      "duration": 20.424,
      "narration": "En el cobro posterior revisa la duración del período adicional y qué importe solicita el formulario. Precio del adicional y precio total de la estadía son conceptos diferentes. Si se calcula con la lista, revisa también el precio de respaldo. Confirma su efecto con permanencias mayores."
    },
    {
      "title": "Un adicional o una regla propia de cada horario",
      "section": "Reglas de más tiempo",
      "start": 562.056,
      "duration": 20.064,
      "narration": "El adicional se suma al precio de la última duración y se cobra por cada período que comienza. También puedes agregar una regla de día o de noche. Esa regla reemplaza a la general en su horario. Si conservas un cálculo anterior, revisa la explicación avanzada antes de cambiarlo."
    },
    {
      "title": "Revisar antes de aplicar",
      "section": "Publicación de precios",
      "start": 582.12,
      "duration": 21.072,
      "narration": "Los cambios del editor siguen siendo un borrador hasta elegir Aplicar tarifas. Antes de publicar, completa todas las filas y compara ejemplos cortos, largos y que crucen de horario. Decide también si deben recalcularse los vehículos que ya están adentro. Esa opción cambia su cálculo desde la entrada."
    },
    {
      "title": "Descartar únicamente el borrador",
      "section": "Salir sin cambiar precios",
      "start": 603.192,
      "duration": 18.288,
      "narration": "Si no quieres publicar la prueba, usa Descartar cambios. El sistema solicita confirmar que deseas descartar el borrador. Esto elimina la edición pendiente y conserva los precios publicados. En esta demostración dejamos las tarifas originales."
    },
    {
      "title": "Volver a consultar los precios actuales",
      "section": "Tarifas vigentes",
      "start": 621.48,
      "duration": 17.16,
      "narration": "Después de descartar, vuelve la lista vigente. Comprueba el vehículo, los horarios y el simulador. Para una modificación real, termina siempre revisando esta pantalla: permite comprobar qué configuración está usando el mostrador."
    },
    {
      "title": "Día, semana y mes tienen sus propias tarifas",
      "section": "Pases por duración",
      "start": 638.64,
      "duration": 18.36,
      "narration": "Día, semana y mes se administran por separado del cobro por tiempo. Elige el vehículo y revisa sus precios por unidad. Una estadía de veinticuatro horas en el cálculo horario no se convierte automáticamente en un pase diario: son modalidades distintas."
    },
    {
      "title": "Vehículo, duración y precio por unidad",
      "section": "Nueva tarifa de pase",
      "start": 657,
      "duration": 21.12,
      "narration": "Nueva tarifa abre el formulario del pase. Selecciona el tipo de vehículo, la duración y el precio por unidad. Ese importe se multiplica por la cantidad elegida al registrar la estadía. Semana y día o mes y día combinan estas mismas tarifas; no necesitan otra tarifa independiente."
    },
    {
      "title": "Revisar la unidad antes de crear",
      "section": "Ejemplo sin guardar",
      "start": 678.12,
      "duration": 19.416,
      "narration": "Aquí mostramos un precio de ejemplo sin guardarlo. Revisa especialmente si el importe corresponde a un día, una semana o un mes, y al vehículo correcto. Crear tarifa publicaría ese nuevo precio. Cerramos la prueba para conservar la configuración vigente."
    },
    {
      "title": "Registrar una estadía larga",
      "section": "Aplicar un pase en el mostrador",
      "start": 697.536,
      "duration": 19.608,
      "narration": "Para usar esas tarifas en la operación, abre Estadía larga. Primero ingresa la patente y el tipo de vehículo. Luego elige la modalidad y la cantidad. Los datos de nombre y apellido son opcionales. Revisa el precio y el vencimiento antes de registrar."
    },
    {
      "title": "Una semana más días sueltos",
      "section": "Cantidad y vencimiento",
      "start": 717.144,
      "duration": 20.736,
      "narration": "Con los controles de cantidad eliges cuántas unidades necesita el cliente. En semanas o meses puedes sumar días sueltos. El sistema muestra hasta cuándo puede quedarse. Comprueba esa fecha con el cliente: corresponde a la modalidad y cantidad seleccionadas, no a una fecha escrita al azar."
    },
    {
      "title": "Cobrar ahora o dejar el pago al retirar",
      "section": "Momento de cobro",
      "start": 737.88,
      "duration": 22.104,
      "narration": "La misma estadía puede cobrarse ahora o dejarse pendiente hasta el retiro. Elige la opción que corresponda y revisa el resumen del botón principal. Registrar estadía confirma el ingreso; si elegiste cobrar ahora, continúa luego con el medio de pago que presente el sistema. Aquí no registramos una estadía de prueba."
    },
    {
      "title": "Probar, revisar y recién después publicar",
      "section": "Resumen de tarifas",
      "start": 759.984,
      "duration": 22.872,
      "narration": "Para configurar tarifas, elige la modalidad, completa precios y horarios, y prueba varios casos en el simulador. Revisa la tolerancia y el alcance sobre vehículos presentes. Para pases, controla precio por unidad, cantidad y vencimiento. Antes de confirmar una operación, comprueba siempre su resumen."
    }
  ],
  "04": [
    {
      "title": "Caja y recaudación son cosas distintas",
      "section": "Administración · Caja",
      "start": 5.4,
      "duration": 19.272,
      "narration": "Desde Administración, Caja, puedes consultar los turnos, registrar ingresos y gastos y abrir la planilla diaria. El efectivo físico incluye el fondo y los movimientos del cajón. La recaudación informa los cobros: compara cada dato con el propósito correcto."
    },
    {
      "title": "Revisar cajas y operadores abiertos",
      "section": "Cajas en curso",
      "start": 24.672,
      "duration": 16.992,
      "narration": "Cajas y turnos abiertos muestra qué cajones están trabajando, quiénes los usan y su efectivo esperado. El fondo compartido se suma una sola vez por caja. Cada operador mantiene su resumen; el último que sale hace el conteo común."
    },
    {
      "title": "Retirar efectivo requiere importe y motivo",
      "section": "Movimiento del cajón",
      "start": 41.664,
      "duration": 18.408,
      "narration": "Retirar efectivo registra dinero que sale físicamente del cajón durante la jornada. Indica importe y motivo y revisa la caja elegida. Un retiro no es automáticamente un gasto del negocio: distingue retirar recaudación de pagar una compra o un servicio."
    },
    {
      "title": "El sistema anticipa el efectivo restante",
      "section": "Retiro durante el turno",
      "start": 60.072,
      "duration": 19.344,
      "narration": "Al indicar un retiro, el formulario muestra cómo quedaría el efectivo disponible. Debe existir dinero suficiente y un motivo. La confirmación guarda responsable y explicación. Aquí completamos un ejemplo y lo cancelamos: el saldo del cajón no cambia."
    },
    {
      "title": "Agregar efectivo no es vender",
      "section": "Aporte de cambio",
      "start": 79.416,
      "duration": 17.784,
      "narration": "Agregar efectivo registra dinero que entra al cajón desde afuera, por ejemplo reposición de cambio. También exige importe y motivo. Un aporte aumenta el efectivo esperado, pero no se considera una venta ni reemplaza el registro de un ingreso del negocio."
    },
    {
      "title": "Registrar conceptos adicionales",
      "section": "Ingresos y gastos",
      "start": 97.2,
      "duration": 19.416,
      "narration": "En Ingresos y gastos se registran conceptos adicionales del negocio, como una compra o un servicio. Los cobros de estacionamiento ya forman parte de su circuito: no los cargues aquí nuevamente. Cada movimiento indica tipo, descripción, importe y forma de pago."
    },
    {
      "title": "Elegir ingreso o egreso",
      "section": "Crear movimiento",
      "start": 116.616,
      "duration": 19.992,
      "narration": "Selecciona Crear y elige el tipo. Ingreso suma un concepto cobrado por fuera del estacionamiento; Egreso registra un gasto. Escribe una descripción que permita identificarlo después. Los importes se cargan positivos: el tipo determina si suman o restan."
    },
    {
      "title": "Descripción e importe claros",
      "section": "Datos del movimiento",
      "start": 136.608,
      "duration": 17.736,
      "narration": "En este ejemplo identificamos el movimiento como demostración y cargamos un importe. Revisa el concepto y la forma de pago antes de crear. Efectivo modifica el dinero físico de la caja correspondiente; una transferencia debe quedar informada por separado."
    },
    {
      "title": "Efectivo y transferencia se informan separados",
      "section": "Forma de pago",
      "start": 154.344,
      "duration": 19.032,
      "narration": "La forma de pago indica por dónde se movió el dinero. Una transferencia no entra al cajón de efectivo. Selecciona la opción que ocurrió realmente y evita elegir efectivo sólo para hacer coincidir un saldo. El tipo de movimiento y el medio cumplen funciones diferentes."
    },
    {
      "title": "Crear registra el movimiento",
      "section": "Revisar la confirmación",
      "start": 173.376,
      "duration": 18.408,
      "narration": "Antes de crear, revisa descripción, tipo, forma de pago e importe. La confirmación guarda el movimiento y no debes cargarlo otra vez en otra pantalla. En esta grabación mostramos el formulario sin guardarlo, para conservar los datos de la cuenta de prueba."
    },
    {
      "title": "Preparar un egreso adicional",
      "section": "Gastos",
      "start": 191.784,
      "duration": 19.128,
      "narration": "Para un gasto selecciona Egreso y describe su motivo. Aquí completamos un ejemplo sin guardarlo. No ingreses el valor con signo negativo: el sistema interpreta la salida a partir del tipo elegido. Confirma sólo cuando el concepto y el pago sean correctos."
    },
    {
      "title": "Comparar tipo, importe y medio",
      "section": "Consulta de conceptos",
      "start": 210.912,
      "duration": 20.136,
      "narration": "La lista diferencia ingresos y egresos e indica su forma de pago. Usa la descripción para reconocer cada concepto. Los cobros de vehículos se revisan en la planilla; esta tabla reúne los movimientos adicionales. Mostramos los registros existentes, sin modificarlos."
    },
    {
      "title": "Filtrar por descripción",
      "section": "Buscar movimientos",
      "start": 231.048,
      "duration": 16.632,
      "narration": "Escribe una parte de la descripción para reducir los resultados. Compara monto, tipo y medio antes de actuar sobre una fila. El filtro sólo cambia la consulta: no altera los movimientos ni modifica el efectivo de la caja."
    },
    {
      "title": "Identificar antes de editar o eliminar",
      "section": "Acciones de la fila",
      "start": 247.68,
      "duration": 17.76,
      "narration": "El menú de cada fila ofrece las acciones permitidas para ese movimiento. Antes de editar o eliminar, identifica exactamente el concepto, el importe y su medio de pago. Aquí abrimos el menú para mostrarlo y salimos sin cambiar ningún registro."
    },
    {
      "title": "Organizar la tabla en la computadora",
      "section": "Orden y columnas",
      "start": 265.44,
      "duration": 19.56,
      "narration": "En la computadora, Vista permite elegir las columnas de la tabla. También puedes filtrar, ordenar y cambiar las filas por página. En el celular se presenta el contenido adaptado a su ancho. Estas herramientas cambian la consulta, no los movimientos registrados."
    },
    {
      "title": "Elegir la fecha que quieres revisar",
      "section": "Planilla diaria",
      "start": 285,
      "duration": 16.44,
      "narration": "La planilla diaria reúne efectivo y cobros de la fecha seleccionada. Usa Hoy, Ayer o el calendario; también puedes pasar al día anterior. Comprueba la fecha antes de comparar totales con un cierre o entregar el documento."
    },
    {
      "title": "Qué incluye el efectivo neto del día",
      "section": "Leer el resumen",
      "start": 301.44,
      "duration": 18.528,
      "narration": "El efectivo neto del día resume entradas y salidas de efectivo. No incluye como dinero físico los cobros electrónicos, ni se debe confundir con el fondo recibido de otro turno. Despliega Qué incluye este total para revisar el alcance antes de comparar importes."
    },
    {
      "title": "Ayer y calendario para revisar días anteriores",
      "section": "Consultar otra fecha",
      "start": 319.968,
      "duration": 16.344,
      "narration": "Usa Ayer para consultar el día anterior o abre el calendario para elegir otra fecha. Una consulta histórica no reabre una caja ni cambia su cierre. Revisa que estés comparando el período correcto y ten presente el corte de medianoche."
    },
    {
      "title": "Elegir una fecha concreta",
      "section": "Calendario",
      "start": 336.312,
      "duration": 17.424,
      "narration": "El calendario permite localizar un día concreto. Las flechas del encabezado avanzan o retroceden entre días y el acceso a Hoy vuelve a la fecha actual. El detalle de caja se actualiza con la selección; espera a que termine de cargar antes de imprimir."
    },
    {
      "title": "Abrir el detalle del turno",
      "section": "Turnos de la fecha",
      "start": 353.736,
      "duration": 17.832,
      "narration": "El resumen del día identifica los turnos que participaron. Abre una fila para ver sus cobros, retiros y vehículos. Un turno puede atravesar medianoche: la planilla separa los días, mientras la jornada y la caja pueden continuar abiertas."
    },
    {
      "title": "Revisar e imprimir la planilla",
      "section": "Planilla y documento",
      "start": 371.568,
      "duration": 18.888,
      "narration": "Imprimir planilla prepara el documento del día seleccionado. Comprueba fecha y totales antes de entregarlo, guardarlo o enviarlo según la opción del sistema. La consulta o la impresión no registran cobros nuevos. En esta grabación dejamos la acción preparada."
    },
    {
      "title": "Filtrar cierres por período y usuario",
      "section": "Historial de turnos",
      "start": 390.456,
      "duration": 17.712,
      "narration": "En el historial puedes elegir el período y filtrar por usuario. Cada cierre conserva responsables, fechas y sus importes. Distingue un cierre real de un corte de medianoche: este último indica que la jornada continúa en la planilla siguiente."
    },
    {
      "title": "Cada cifra responde a una pregunta",
      "section": "Control final",
      "start": 408.168,
      "duration": 20.28,
      "narration": "Para controlar la jornada, compara la planilla del día, los conceptos adicionales y el cierre del turno. Usa el efectivo esperado para contar el cajón, y los cobros para revisar la recaudación. Mantén separados gastos, retiros de efectivo y transferencias para evitar duplicaciones."
    }
  ],
  "05": [
    {
      "title": "Trabajar con el usuario y la playa correctos",
      "section": "Administrar el estacionamiento",
      "start": 5.4,
      "duration": 20.688,
      "narration": "Vamos a recorrer las herramientas de administración desde una computadora y un celular. Antes de configurar, comprueba quién inició sesión y en qué playa estás trabajando. El administrador configura la empresa y accede a sus playas; el operador trabaja con los ingresos y salidas de la playa que tiene asignada."
    },
    {
      "title": "Comprobar el usuario antes de trabajar",
      "section": "Cuenta actual",
      "start": 26.088,
      "duration": 18.888,
      "narration": "El menú de tu cuenta permite comprobar quién inició sesión y acceder a las opciones disponibles para ese usuario. Si varias personas usan la misma computadora, cada una debe trabajar con su propia cuenta. Esto permite identificar las operaciones y los turnos de cada operador."
    },
    {
      "title": "Distinguir administradores y operadores",
      "section": "Usuarios y permisos",
      "start": 44.976,
      "duration": 18.36,
      "narration": "Usuarios muestra las cuentas, sus roles y la playa asignada. Los resúmenes indican cuántos administradores y operadores hay, y si queda alguno sin playa. Cada persona debe utilizar su propia cuenta para que sus acciones y turnos queden identificados."
    },
    {
      "title": "Localizar al usuario por nombre, usuario o correo",
      "section": "Buscar una cuenta",
      "start": 63.336,
      "duration": 16.872,
      "narration": "Puedes filtrar por rol o buscar por nombre, nombre de usuario o correo. La lista se adapta al celular con tarjetas. Antes de editar o asignar una playa, comprueba el nombre y el correo de la persona para actuar sobre la cuenta correcta."
    },
    {
      "title": "Elegir el rol y completar el perfil",
      "section": "Crear una cuenta",
      "start": 80.208,
      "duration": 22.656,
      "narration": "Nuevo usuario permite preparar una cuenta de operador o administrador. Elige el rol según las tareas de esa persona. Completa nombre, apellido, usuario y correo. Luego define y repite una contraseña. La cuenta se crea al confirmar el formulario; aquí mostramos el ejemplo sin crearla."
    },
    {
      "title": "Datos personales y credenciales de la cuenta",
      "section": "Datos de acceso",
      "start": 102.864,
      "duration": 19.68,
      "narration": "El nombre identifica a la persona y el nombre de usuario sirve para reconocer su cuenta. Revisa el correo antes de guardar. Usa una contraseña propia para cada usuario y comprueba que ambas contraseñas coincidan. El botón para verla sólo cambia su visualización durante la carga."
    },
    {
      "title": "Administrador o acceso operativo",
      "section": "Alcance del rol",
      "start": 122.544,
      "duration": 21.216,
      "narration": "Administrador permite configurar la empresa y ver todas sus playas. Operador registra entradas y salidas en la playa asignada. Revisa esta elección antes de crear la cuenta: otorgar administración amplía sus permisos. El ejemplo cambia la selección del formulario, sin guardar una cuenta."
    },
    {
      "title": "Un operador necesita su lugar de trabajo",
      "section": "Asignar la playa",
      "start": 143.76,
      "duration": 21.12,
      "narration": "Un operador sin playa aparece pendiente de asignación. Asignar playa abre la selección de su lugar de trabajo. Selecciona la playa correcta y confirma el cambio cuando corresponda. La pantalla indica que se aplicará en su próximo ingreso. En la demostración sólo revisamos la selección."
    },
    {
      "title": "Elegir y comprobar antes de guardar",
      "section": "Revisar la asignación",
      "start": 164.88,
      "duration": 18.456,
      "narration": "La selección muestra las playas disponibles de la empresa. Revisa el nombre del operador en el título y la playa elegida. Al guardar, el operador queda asociado a ese lugar. Cerramos sin confirmar para conservar los permisos de la cuenta de prueba."
    },
    {
      "title": "Actualizar datos y revisar permisos",
      "section": "Editar un perfil",
      "start": 183.336,
      "duration": 20.808,
      "narration": "Editar abre el perfil de la persona seleccionada. Puedes revisar los datos de la cuenta y el rol disponible. Cambiar un rol requiere revisar su acceso y, si pasa a operador, su playa. Los cambios se aplican al guardar. No necesitas eliminar la cuenta para corregir un dato del perfil."
    },
    {
      "title": "Revisar los campos disponibles para esa cuenta",
      "section": "Perfil y contraseña",
      "start": 204.144,
      "duration": 20.208,
      "narration": "Dentro del perfil se distinguen los datos personales y las opciones de contraseña. Comprueba qué campos permite modificar tu cuenta antes de guardar. Al cambiar una contraseña, completa los datos que solicita el formulario y repite la nueva. Cerramos esta vista sin modificar el perfil."
    },
    {
      "title": "Opciones de operación, comprobantes y cobros",
      "section": "Configuración",
      "start": 224.352,
      "duration": 19.224,
      "narration": "Configuración reúne las opciones de esta playa: operación, entrega de comprobantes y cobro con Mercado Pago. Los importes y la forma de calcular una estadía se cambian en Tarifas. Elige la sección correspondiente para revisar cada configuración sin mezclar sus efectos."
    },
    {
      "title": "Activar según la forma de trabajo",
      "section": "Turnos de caja",
      "start": 243.576,
      "duration": 22.8,
      "narration": "Operación incluye Turnos de caja. Activarlos identifica el trabajo de cada operador; apagados, el sistema permite cobrar sin turno. La configuración continúa con modo simple o múltiple, cajas y sueldo. La guía de cobros muestra esos pasos completos. Aquí conservamos el estado actual."
    },
    {
      "title": "Definir qué vehículos recibe esta playa",
      "section": "Tipos de vehículo",
      "start": 266.376,
      "duration": 19.608,
      "narration": "En Vehículos eliges los tipos que recibe la playa. Puedes cambiar el nombre visible de un tipo existente o agregar uno nuevo. Los códigos permiten identificarlo en el sistema y las tarifas dependen de ese tipo. Antes de admitir su primera entrada, debes cargar sus precios."
    },
    {
      "title": "Nombre visible y código único",
      "section": "Agregar un tipo",
      "start": 285.984,
      "duration": 19.872,
      "narration": "Para agregar otro vehículo, escribe el nombre que verá el operador, por ejemplo Moto. El código se propone a partir del nombre y puedes revisarlo antes de agregarlo. Debe ser corto y único; se elige una sola vez. Este formulario queda como ejemplo sin guardar."
    },
    {
      "title": "Una opción afecta los nuevos ingresos",
      "section": "Recibir o desactivar",
      "start": 305.856,
      "duration": 21.408,
      "narration": "El interruptor Recibir de cada tipo guarda el cambio al accionarlo. Si desactivas un tipo, deja de ofrecerse para nuevas entradas. Los vehículos que ya ingresaron pueden salir normalmente. Guardar nombre es un control separado. Revisa esta diferencia antes de usar cualquiera de los dos."
    },
    {
      "title": "Elegir medios de entrega según el mostrador",
      "section": "Comprobantes",
      "start": 327.264,
      "duration": 19.608,
      "narration": "Comprobantes permite elegir y combinar los medios de entrega de esta playa. El código en pantalla permite que el cliente abra su comprobante desde su celular. La impresión entrega una copia en papel desde la computadora del mostrador. La selección se aplica al guardar la configuración."
    },
    {
      "title": "El cliente puede abrir y descargar el comprobante",
      "section": "Código en pantalla",
      "start": 346.872,
      "duration": 17.832,
      "narration": "QR en pantalla ofrece un código para que el cliente consulte el comprobante sin iniciar sesión. Desde su celular puede descargarlo en PDF o imagen. Es una opción de entrega: no debe confundirse con el código QR utilizado para cobrar una estadía."
    },
    {
      "title": "Activar papel y elegir el ancho correcto",
      "section": "Impresora del mostrador",
      "start": 364.704,
      "duration": 20.376,
      "narration": "Impresora USB utiliza una térmica instalada en la computadora. Al seleccionar papel, revisa si tu equipo usa cincuenta y ocho u ochenta milímetros. El ancho debe coincidir con el rollo y el controlador de la impresora. Estos cambios del formulario aún requieren guardar."
    },
    {
      "title": "Comprobar ancho, impresora y márgenes",
      "section": "Preparar la impresión",
      "start": 385.08,
      "duration": 17.736,
      "narration": "Puedes seleccionar cincuenta y ocho milímetros si corresponde a tu térmica. Al imprimir, elige la impresora del mostrador y desactiva los encabezados y pies de página del navegador. Haz una prueba de lectura de la patente y los importes antes de empezar a atender."
    },
    {
      "title": "La selección se aplica a esta playa",
      "section": "Guardar los medios de entrega",
      "start": 402.816,
      "duration": 20.376,
      "narration": "Guardar configuración confirma la combinación de medios de esta playa. Si todos están desactivados, no se ofrecen opciones de entrega. Aquí salimos sin guardar la prueba. Antes de un cambio real, comprueba la playa seleccionada y que el mostrador tenga los dispositivos necesarios."
    },
    {
      "title": "Una cuenta de cobro para la empresa",
      "section": "Cobros digitales",
      "start": 423.192,
      "duration": 21.216,
      "narration": "Mercado Pago se configura en cuatro pasos: cuenta, QR, alias y comisiones. La cuenta vinculada pertenece a la empresa y se usa para sus playas. Antes de configurar, revisa el titular y el estado de conexión. Es la cuenta que recibe el dinero de los cobros correspondientes."
    },
    {
      "title": "Comprobar el destino de los cobros",
      "section": "Cuenta vinculada",
      "start": 444.408,
      "duration": 20.856,
      "narration": "Una cuenta conectada muestra el titular, el correo y el estado del permiso. Revisa que sea la cuenta donde quieres recibir el dinero. Desconectar o conectar otra cuenta cambia esa vinculación; son decisiones distintas de consultar la configuración. Para esta guía conservamos la cuenta existente."
    },
    {
      "title": "Revisar la habilitación de cada playa",
      "section": "QR interoperable",
      "start": 465.264,
      "duration": 20.856,
      "narration": "El paso QR muestra la preparación de cada playa para cobrar desde bancos o billeteras compatibles. Comprueba si está lista o si solicita completar su dirección y ubicación. Esta preparación se realiza en configuración. El código de una operación concreta se genera al cobrar desde el mostrador."
    },
    {
      "title": "Verificar el alias que verá el cliente",
      "section": "Transferencias al alias",
      "start": 486.12,
      "duration": 22.056,
      "narration": "El paso Alias permite revisar la verificación de transferencias, cuando está incluida. El alias mostrado debe coincidir con la cuenta de destino. Si se ofrece al cobrar, el sistema busca el ingreso y puede pedir elegir una transferencia cuando hay coincidencias. Revisa los datos y guarda sólo cuando quieras aplicar el cambio."
    },
    {
      "title": "Diferenciar el cobro y el neto recibido",
      "section": "Comisiones",
      "start": 508.176,
      "duration": 22.728,
      "narration": "Comisiones permite configurar las tasas utilizadas para calcular el neto de los cobros digitales. Revisa cada medio por separado: no todos tienen el mismo costo. El importe cobrado al cliente y el neto estimado después de comisiones son valores diferentes. La planilla utiliza esa configuración al mostrar sus resúmenes."
    },
    {
      "title": "Comprobar porcentajes antes de guardar",
      "section": "Revisión de costos",
      "start": 530.904,
      "duration": 21.312,
      "narration": "Revisa los porcentajes y la explicación que acompaña cada campo antes de guardar. La configuración debe reflejar los costos de tu cuenta. Si sólo estás consultando, puedes salir sin cambiar valores. Después, contrasta los totales de la planilla con los movimientos y liquidaciones de tu cuenta de cobro."
    },
    {
      "title": "Consultar las notas del equipo",
      "section": "Avisos internos",
      "start": 552.216,
      "duration": 19.248,
      "narration": "Avisos reúne las notas internas para el equipo de la playa. Revisa las más recientes y usa los controles de búsqueda o período disponibles para localizar una. Una nota ayuda a comunicar una tarea, pero no reemplaza el registro de una entrada, un cobro o un movimiento de caja."
    },
    {
      "title": "Una descripción clara para el equipo",
      "section": "Preparar un aviso",
      "start": 571.464,
      "duration": 19.032,
      "narration": "Nuevo aviso abre una descripción. Escribe qué debe hacerse y la referencia necesaria para que el equipo lo entienda. Crear aviso lo publicaría para los demás. En esta demostración sólo preparamos el texto y lo cancelamos; no enviamos ni publicamos un mensaje."
    },
    {
      "title": "Cancelar la prueba y volver a la lista",
      "section": "Consultar sin publicar",
      "start": 590.496,
      "duration": 18.96,
      "narration": "Cancelar cierra el formulario sin crear el aviso. En la lista, comprueba autor y fecha antes de actuar sobre una nota. Si editas o eliminas un aviso existente, revisa sus datos y el alcance de la acción. Aquí mantenemos las notas originales del equipo."
    },
    {
      "title": "Buscar al cliente y revisar sus estadías",
      "section": "Clientes frecuentes",
      "start": 609.456,
      "duration": 20.664,
      "narration": "Frecuentes permite consultar los clientes que vuelven y su historial. Filtra por período, tipo de vehículo y mínimo de visitas. Después aplica los filtros para actualizar la lista. Los datos personales del mostrador son opcionales; el historial permite reconocer al cliente por su patente."
    },
    {
      "title": "Período, vehículo y cantidad de visitas",
      "section": "Filtrar frecuentes",
      "start": 630.12,
      "duration": 20.76,
      "narration": "Seleccionamos Camioneta y un mínimo de tres visitas, y aplicamos el filtro. La lista muestra el criterio utilizado, las visitas, la última fecha, la permanencia típica y el gasto registrado. Revisa el período antes de comparar clientes: limita la información incluida en el resultado."
    },
    {
      "title": "Consultar las visitas de la patente elegida",
      "section": "Historial de un cliente",
      "start": 650.88,
      "duration": 18.912,
      "narration": "Ver historial abre las visitas de ese cliente. Comprueba la patente del encabezado y recorre las fechas, permanencias e importes disponibles. Esta consulta permite revisar las operaciones anteriores de esa persona sin modificar una estadía ni registrar un nuevo cobro."
    },
    {
      "title": "Consultar las operaciones con sus filtros",
      "section": "Planilla de vehículos",
      "start": 669.792,
      "duration": 20.784,
      "narration": "Vehículos reúne la planilla de operaciones. Selecciona el período y los filtros disponibles antes de buscar una entrada o salida. Comprueba patente, fecha y estado. Esta consulta permite revisar el registro; el mostrador sigue siendo el lugar para ingresar un vehículo o cobrar su salida."
    },
    {
      "title": "Configurar, comprobar y luego operar",
      "section": "Administración revisada",
      "start": 690.576,
      "duration": 24,
      "narration": "Antes de empezar, revisa usuarios y playas, los vehículos admitidos, sus tarifas y los medios de entrega. Para cobros digitales, comprueba la cuenta, la preparación de la playa y sus comisiones. Después usa los historiales y la planilla para controlar la operación. Cada guía del centro de aprendizaje recorre esas tareas paso a paso."
    }
  ]
};
