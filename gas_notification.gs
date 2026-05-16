function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const name = postData.name || 'No Name';
    const email = postData.email || 'No Email';
    const phone = postData.phone || 'No Phone';
    const orderDetails = postData.orderDetails || 'No Details';
    const totalPrice = postData.totalPrice || 0;
    
    // 1. Save to Google Sheet
    // This assumes the script is bound to a Google Sheet.
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const timestamp = new Date();
    // Headers should be: Timestamp | Name | Phone | Email | Order Details | Total Price
    sheet.appendRow([timestamp, name, phone, email, orderDetails, totalPrice]);

    // 2. Send Email Notification
    const recipientEmail = "tabloria3d@gmail.com";
    const emailSubject = `New Order from ${name} (Tabloria 3D)`;
    const emailBody = `
You have a new order from your website!
      
Name: ${name}
Email: ${email}
Phone: ${phone}
      
Order Details:
${orderDetails}
      
Total Price: ${totalPrice} EGP
      
Customer WhatsApp Link: https://wa.me/${phone.replace(/[^0-9]/g, '')}
`;
    
    MailApp.sendEmail(recipientEmail, emailSubject, emailBody);

    // 3. Send WhatsApp Notification via CallMeBot
    const myWhatsAppNumber = "201067826826"; 
    const callMeBotApiKey = "7695586";
    
    const waMessage = `*New Order from Tabloria 3D*%0A*Name:* ${name}%0A*Phone:* ${phone}%0A%0A*Order:*%0A${orderDetails.replace(/\n/g, "%0A")}%0A%0A*Total:* ${totalPrice} EGP`;
    const url = `https://api.callmebot.com/whatsapp.php?phone=${myWhatsAppNumber}&text=${waMessage}&apikey=${callMeBotApiKey}`;
    
    UrlFetchApp.fetch(url, { muteHttpExceptions: true });

    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.message }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
  }
}

function doOptions(e) {
  return ContentService.createTextOutput()
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}

/* 
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Go to Google Sheets (sheets.new) and create a new spreadsheet called "Tabloria Orders".
 * 2. Set the first row headers to: Timestamp | Name | Phone | Email | Order Details | Total Price
 * 3. Click "Extensions" > "Apps Script".
 * 4. Paste this entire code into the editor (replace existing code).
 * 5. Click "Deploy" > "New deployment".
 * 6. Select type: "Web app".
 * 7. Set "Execute as" to "Me".
 * 8. Set "Who has access" to "Anyone".
 * 9. Click "Deploy" and authorize the app.
 * 10. Copy the "Web app URL" and paste it into `assets/js/cart.js` where indicated!
 */
