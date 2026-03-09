import { useState } from 'react'
import { ScanBarcode, AlertCircle, Loader2 } from 'lucide-react'
import { Scanner } from './components/Scanner'
import { ProductView } from './components/ProductView'
import { SearchBar } from './components/SearchBar'
import { productService } from './services/api'
import type { Product } from './types'
import startoolsLogo from './assets/Startools_LOGO.svg'

function App() {
  const [isScanning, setIsScanning] = useState(false)
  const [loadingProduct, setLoadingProduct] = useState(false)
  const [errorSearch, setErrorSearch] = useState('')
  const [product, setProduct] = useState<Product | null>(null)

  const handleScan = async (barcode: string) => {
    // Stop scanning once we get a code
    setIsScanning(false)
    handleSearchProduct(barcode)
  }

  const handleSearchProduct = async (query: string) => {
    setLoadingProduct(true)
    setErrorSearch('')

    try {
      const foundProduct = await productService.getProductByGtin13(query)
      if (foundProduct) {
        setProduct(foundProduct)
      } else {
        setErrorSearch(`Produto não encontrado (Código: ${query})`)
      }
    } catch (err) {
      setErrorSearch('Erro ao buscar produto.')
    } finally {
      setLoadingProduct(false)
    }
  }

  // If we have a product selected, show the ProductView
  if (product) {
    return <ProductView product={product} onBack={() => setProduct(null)} />
  }

  return (
    <div className="container animate-fade-in" style={{ alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>

      {/* Google-like center layout */}
      <img
        src={startoolsLogo}
        alt="Startools Logo"
        style={{
          marginBottom: '32px',
          width: '100%',
          maxWidth: '300px',
          height: 'auto',
          filter: 'drop-shadow(0 0 30px rgba(255, 209, 0, 0.15))'
        }}
      />

      <div style={{ width: '100%', marginBottom: '24px', position: 'relative', zIndex: 20 }}>
        <SearchBar onSelectProduct={setProduct} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', width: '100%' }}>
        <p className="text-secondary" style={{ fontSize: '14px', margin: 0 }}>ou utilize a câmera do seu dispositivo</p>

        <button onClick={() => setIsScanning(true)} style={{ width: '100%', maxWidth: '300px', fontSize: '16px', padding: '14px' }}>
          <ScanBarcode size={20} /> ESCANEAR CÓDIGO
        </button>
      </div>

      {/* States Feedback Below Button */}
      {loadingProduct && (
        <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)' }}>
          <Loader2 className="animate-spin" size={20} /> <span style={{ fontWeight: 500 }}>Buscando produto...</span>
        </div>
      )}

      {errorSearch && (
        <div className="card" style={{ marginTop: '24px', width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <AlertCircle color="var(--color-error)" size={32} />
          <p style={{ color: 'var(--color-error)', fontSize: '14px' }}>{errorSearch}</p>
        </div>
      )}

      {isScanning && (
        <Scanner
          onScan={handleScan}
          onClose={() => setIsScanning(false)}
        />
      )}
    </div>
  )
}

export default App
