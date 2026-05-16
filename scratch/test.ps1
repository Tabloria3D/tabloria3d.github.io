$body = '{"name": "Test", "email": "test@test.com", "phone": "01000000", "orderDetails": "Item 1", "totalPrice": 100}'
$response = Invoke-RestMethod -Uri "https://script.google.com/macros/s/AKfycbxfwXY4CUlkAjEf608ZB5BgUTDxEoRZIN2hqF5FAVsTy61P7I4HpjsDWhz48L92GDMXeQ/exec" -Method Post -Body $body -ContentType "text/plain"
$response | ConvertTo-Json
