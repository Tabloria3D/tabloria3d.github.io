$json = Get-Content -Raw -Path "data.json" | ConvertFrom-Json
$products = $json.products

$outDir = "_products"
if (!(Test-Path -Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir | Out-Null
}

foreach ($product in $products) {
    # Escape quotes in title
    $title = $product.title -replace '"', '\"'
    $handle = $product.handle
    $price = $product.price
    $image = $product.image
    $description = $product.description

    # Simple category logic based on title/handle
    $category = "figures"
    if ($handle -match "portrait") {
        $category = "portraits"
    }

    $mdContent = @"
---
layout: product
title: "$title"
price: $price
image: "$image"
category: "$category"
---
$description
"@

    $filePath = "$outDir\$handle.md"
    Set-Content -Path $filePath -Value $mdContent -Encoding UTF8
}
Write-Host "Done generating markdown files."
