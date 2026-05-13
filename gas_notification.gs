function doPost(e) {
  try {
    const params = e.parameter || {};
    const name = params.name || 'No Name';
    const email = params.email || 'No Email';
    const phone = params.phone || 'No Phone';
    const message = params.message || 'No Message';
    const product = params.product || 'General Inquiry';

    // 1. Send Email Notification
    const recipientEmail = "tabloria3d@gmail.com";
    const emailSubject = `New Inquiry from ${name} (Tabloria 3D)`;
    const emailBody = `
      You have a new inquiry from your website!
      
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Product/Subject: ${product}
      Message: ${message}
      
      Customer WhatsApp Link: https://wa.me/${phone.replace(/[^0-9]/g, '')}
    `;
    
    MailApp.sendEmail(recipientEmail, emailSubject, emailBody);

    // 2. Send WhatsApp Notification via CallMeBot
    // IMPORTANT: Replace YOUR_CALLMEBOT_API_KEY with your actual CallMeBot API key
    // You get this by sending a WhatsApp message to CallMeBot. 
    // See https://www.callmebot.com/blog/free-api-whatsapp-messages/
    const myWhatsAppNumber = "+201277073553"; // Your number in international format
    const callMeBotApiKey = "YOUR_CALLMEBOT_API_KEY"; // REPLACE THIS
    
    if (callMeBotApiKey !== "YOUR_CALLMEBOT_API_KEY") {
      const waMessage = `*New Lead from Tabloria 3D* %0A*Name:* ${name} %0A*Phone:* ${phone} %0A*Product:* ${product} %0A*Message:* ${message} %0A*Contact:* https://wa.me/${phone.replace(/[^0-9]/g, '')}`;
      const url = `https://api.callmebot.com/whatsapp.php?phone=${myWhatsAppNumber}&text=${waMessage}&apikey=${callMeBotApiKey}`;
      
      UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    }

    // Return CORS headers and success response
    return ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "Inquiry sent successfully" }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.message }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
  }
}

// For pre-flight requests (CORS)
function doOptions(e) {
  return ContentService.createTextOutput()
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}

/* 
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Go to https://script.google.com/ and create a new project.
 * 2. Paste this entire code into the editor (replace existing code).
 * 3. Save the project as "Tabloria3D Website Form Handler".
 * 4. Replace "YOUR_CALLMEBOT_API_KEY" with your actual API key from CallMeBot.
 * 5. Click "Deploy" > "New deployment".
 * 6. Select type: "Web app".
 * 7. Set "Execute as" to "Me".
 * 8. Set "Who has access" to "Anyone".
 * 9. Click "Deploy" and authorize the app.
 * 10. Copy the "Web app URL" and paste it into the `scriptUrl` variable in `assets/js/main.js`.
 */
