$ErrorActionPreference = "Stop"

$url = "https://tabloria-3d.myshopify.com/products.json?limit=250"
Write-Host "Fetching products from Shopify..."

$response = Invoke-RestMethod -Uri $url -Method Get
$productsData = $response.products

$imagesDir = Join-Path $PSScriptRoot "assets\images"
if (!(Test-Path $imagesDir)) {
    New-Item -ItemType Directory -Force -Path $imagesDir | Out-Null
}

$products = @()

foreach ($p in $productsData) {
    $localImages = @()
    $productImagesDir = Join-Path $imagesDir $p.handle
    
    if ($p.images -and $p.images.Count -gt 0) {
        if (!(Test-Path $productImagesDir)) {
            New-Item -ItemType Directory -Force -Path $productImagesDir | Out-Null
        }
        
        for ($i = 0; $i -lt $p.images.Count; $i++) {
            $imageObj = $p.images[$i]
            $imageUrl = $imageObj.src
            
            # Extract extension, clean query params
            $uri = [System.Uri]::new($imageUrl)
            $ext = [System.IO.Path]::GetExtension($uri.AbsolutePath)
            if ([string]::IsNullOrEmpty($ext)) { $ext = ".jpg" }
            
            $filename = "$($p.handle)-$($i + 1)$ext"
            $localImage = "assets/images/$($p.handle)/$filename"
            $destPath = Join-Path $productImagesDir $filename
            
            Write-Host "Downloading $imageUrl to $localImage..."
            try {
                Invoke-WebRequest -Uri $imageUrl -OutFile $destPath
                $localImages += $localImage
            } catch {
                Write-Host "Failed to download $imageUrl : $_" -ForegroundColor Red
            }
        }
    }
    
    $bodyHtml = $p.body_html
    if ($bodyHtml) {
        $desc = $bodyHtml -replace '<[^>]*>?',''
        $desc = $desc.Trim()
    } else {
        $desc = ""
    }
    
    $price = "0.00"
    $compareAtPrice = $null
    if ($p.variants -and $p.variants.Count -gt 0) {
        if ($p.variants[0].price) { $price = $p.variants[0].price }
        if ($p.variants[0].compare_at_price) { $compareAtPrice = $p.variants[0].compare_at_price }
    }
    
    $firstImage = ""
    if ($localImages.Count -gt 0) {
        $firstImage = $localImages[0]
    }
    
    $productObj = [ordered]@{
        id = $p.id
        title = $p.title
        handle = $p.handle
        description = $desc
        price = $price
        compareAtPrice = $compareAtPrice
        image = $firstImage
        images = $localImages
    }
    
    $products += $productObj
}

$siteInfo = [ordered]@{
    name = "TABLORIA 3D"
    contact = [ordered]@{
        phone = "01277073553"
        whatsapp = "01277073553"
        email = "tabloria3d@gmail.com"
    }
    colors = [ordered]@{
        primary = "#000000"
        secondary = "#ffffff"
        accent = "#e53e3e"
    }
}

$siteData = [ordered]@{
    siteInfo = $siteInfo
    products = $products
}

$jsonPath = Join-Path $PSScriptRoot "data.json"
$siteData | ConvertTo-Json -Depth 10 | Set-Content $jsonPath -Encoding UTF8

Write-Host "data.json written successfully!"
