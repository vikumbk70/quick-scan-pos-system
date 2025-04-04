
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { Barcode, Minus, Plus, Search, ShoppingCart, Trash } from 'lucide-react';
import { Product } from '@/types';
import { getProducts } from '@/services/products';
import { getCategories } from '@/services/categories';

const POS = () => {
  const { items, addItem, removeItem, updateQuantity, totalItems, totalAmount } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [currentCategory, setCurrentCategory] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [barcodeInput, setBarcodeInput] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await getProducts(1, 100);
        const categoriesResponse = await getCategories();
        
        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!barcodeInput.trim()) return;
    
    // In a real app, you would search for a product by barcode
    // For demo, let's just add a random product
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    
    if (randomProduct) {
      addItem(randomProduct);
      setBarcodeInput('');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = currentCategory === 'all' || product.category_id === currentCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Point of Sale</h1>
      </div>

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 h-[calc(100vh-14rem)]">
        {/* Product Selection Area */}
        <div className="flex flex-col w-full md:w-2/3 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <form onSubmit={handleBarcodeSubmit} className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  <Barcode className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Scan barcode..."
                    className="pl-8"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="outline">Scan</Button>
              </form>
            </div>
            
            <Tabs defaultValue="all" onValueChange={(value) => setCurrentCategory(value === 'all' ? 'all' : parseInt(value))}>
              <TabsList className="w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id.toString()}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="flex-1 p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto">
              {filteredProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => addItem(product)}
                >
                  <CardContent className="p-3 flex flex-col items-center justify-center text-center">
                    <div 
                      className="w-full h-24 bg-muted mb-2 rounded flex items-center justify-center"
                      style={{
                        backgroundImage: product.image ? `url(${product.image})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      {!product.image && <Package className="h-12 w-12 text-muted-foreground/50" />}
                    </div>
                    <div className="font-medium truncate w-full">{product.name}</div>
                    <div className="text-sm text-muted-foreground truncate w-full">{product.description}</div>
                    <Badge variant="outline" className="mt-1">${product.price.toFixed(2)}</Badge>
                  </CardContent>
                </Card>
              ))}
              
              {filteredProducts.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center text-muted-foreground p-8">
                  <ShoppingCart className="h-12 w-12 mb-2" />
                  <p>No products found</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cart & Checkout Area */}
        <div className="flex flex-col w-full md:w-1/3 bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Current Order</h2>
              <Badge variant="outline">{totalItems} items</Badge>
            </div>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mb-2" />
                <p>Your cart is empty</p>
                <p className="text-sm">Add products to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div 
                    key={item.product_id} 
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{item.product?.name}</div>
                      <div className="text-sm text-muted-foreground">
                        ${item.product?.price.toFixed(2)} each
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      
                      <span className="w-8 text-center">{item.quantity}</span>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeItem(item.product_id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-4 border-t">
            <div className="space-y-4">
              <div className="flex items-center justify-between font-medium">
                <span>Subtotal:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Tax (10%):</span>
                <span>${(totalAmount * 0.1).toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${(totalAmount * 1.1).toFixed(2)}</span>
              </div>
              
              <Button className="w-full" size="lg" disabled={items.length === 0}>
                Complete Sale
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
