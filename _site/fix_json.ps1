$json = Get-Content -Raw -Path "data.json" -Encoding UTF8 | ConvertFrom-Json
$products = $json.products

$outDir = "_products"
if (!(Test-Path -Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir | Out-Null
}

$Utf8NoBomEncoding = New-Object System.Text.UTF8Encoding $False

foreach ($product in $products) {
    # Escape quotes in title
    $title = $product.title -replace '"', '\"'
    $handle = $product.handle
    $price = $product.price
    $image = $product.image
    $description = $product.description

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
    [System.IO.File]::WriteAllText($filePath, $mdContent, $Utf8NoBomEncoding)
}
Write-Host "Done regenerating markdown files without BOM."
