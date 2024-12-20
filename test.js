const { chromium } = require('playwright'); //módulo chromium de Playwright, que permite automatizar navegadores basados en Chromium como Google Chrome o Microsoft Edge.


(async () => {
  // Lanzar el navegador
  const browser = await chromium.launch({ headless: false }); // Cambia a true para ejecución sin interfaz gráfica
  const page = await browser.newPage(); //abre nueva pestaña 
  // Navegar a la página con el formulario
  await page.goto('https://www.mascarasacf.com.ar/account/register'); 

  // Completar el campo de nombre
  await page.fill('#name', 'María Pérez'); //page.fill(selector, value): Busca el campo por el selector CSS (#name) y llena el campo con el valor proporcionado
  console.log('✅ Campo de nombre completado.');

  // Completar el campo de correo electrónico
  await page.fill('#email', 'correo@ejemmplo.com');
  console.log('✅ Campo de correo completado.');

  // Completar el campo de teléfono (opcional)
  const telefonoSelector = '#phone';
  if (await page.$(telefonoSelector)) {
    await page.fill(telefonoSelector, '1123445567');
    console.log('✅ Campo de teléfono completado.');
  } else {
    console.log('⚠️ Campo de teléfono no encontrado (puede ser opcional).');
  }

  // Completar el campo de contraseña
  await page.fill('#password', 'MiContraseña123');
  console.log('✅ Campo de contraseña completado.');

  // Completar el campo de confirmación de contraseña
  await page.fill('#password_confirmation', 'MiContraseña123');
  console.log('✅ Campo de confirmación de contraseña completado.');

  // Verificar que las contraseñas coincidan
  const passwordValue = await page.inputValue('#password'); //page.fill(selector, value): Busca el campo por el selector CSS (#name) y llena el campo con el valor proporcionado
  const confirmPasswordValue = await page.inputValue('#password_confirmation');
  if (passwordValue === confirmPasswordValue) {
    console.log('✅ Las contraseñas coinciden correctamente.');
  } else {
    console.log('❌ Las contraseñas no coinciden.');
    return; // Detener el script si las contraseñas no coinciden
  }

  // Verificar y manejar el checkbox "No soy un robot" (reCAPTCHA)
  try {
    const recaptchaIframeSelector = 'iframe[title="reCAPTCHA"]';
    const recaptchaFrame = await page.frameLocator(recaptchaIframeSelector);

    if (recaptchaFrame) {
      //recatpcha manualemnte
      console.log('⚠️ Manejo del reCAPTCHA no implementado (requiere intervención manual).');
    } else {
      console.log('⚠️ reCAPTCHA no encontrado.');
    }
  } catch (error) {
    console.log('⚠️ Error manejando el reCAPTCHA:', error.message);
  }

  // Hacer clic en el botón "Crear cuenta"
  const submitButtonSelector = '.btn.btn-primary.js-recaptcha-button';
  await page.waitForSelector(`${submitButtonSelector}:not([disabled])`); // Asegurarse de que el botón esté habilitado
  await page.click(submitButtonSelector);
  console.log('✅ Botón "Crear cuenta" clickeado.');

  // Esperar el resultado (por ejemplo, una navegación o mensaje de éxito)
  await page.waitForTimeout(3000); 
  const url = page.url();
  console.log(`URL después de enviar el formulario: ${url}`);

  // Verificar si el formulario se envió correctamente
  try {
    // Esperar a que el mensaje de éxito aparezca
    await page.waitForSelector('.js-account-validation-pending', { timeout: 5000 });
    console.log('✅ Formulario enviado exitosamente y se muestra el mensaje de validación.');
  } catch (error) {
    console.log('❌ El mensaje de validación no apareció. Puede haber un problema en el envío del formulario.');
  }

  // Cerrar el navegador
  await browser.close();
})();
