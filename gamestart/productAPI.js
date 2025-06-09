// ProductAPI.js
export async function getProductInfo(barcode) {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    )
    const data = await response.json()

    if (data.status === 1) {
      return {
        name: data.product.product_name,
        brand: data.product.brands,
        ingredients: data.product.ingredients_text,
        nutrition: data.product.nutriments,
        image: data.product.image_url,
      }
    }
    return null
  } catch (error) {
    console.error('Error fetching product data:', error)
    return null
  }
}

// For when you don't have barcodes
export async function searchProducts(query) {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
        query
      )}&json=1`
    )
    const data = await response.json()
    console.log('ok', data)

    return data.products || []
  } catch (error) {
    console.error('Error searching products:', error)
    return []
  }
}
