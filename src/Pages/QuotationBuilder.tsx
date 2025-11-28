import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  Plus, 
  Minus, 
  Trash2, 
  FileText, 
  Send, 
  Package, 
  ArrowRight,
  Calculator,
  User,
  Building,
  Mail,
  Phone,
  Calendar,
  Percent
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays } from 'date-fns';

export default function QuotationBuilder() {
  const [items, setItems] = useState([]);
  const [clientInfo, setClientInfo] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    client_company: '',
    notes: ''
  });
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(10);
  const [step, setStep] = useState(1);

  const { data: products = [] } = useQuery({
    queryKey: ['products-for-quote'],
    queryFn: () => base44.entities.Product.list('name', 100),
  });

  useEffect(() => {
    const savedItems = localStorage.getItem('quoteItems');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('quoteItems', JSON.stringify(items));
  }, [items]);

  const createQuotation = useMutation({
    mutationFn: (data) => base44.entities.Quotation.create(data),
    onSuccess: (data) => {
      toast.success('Quotation created successfully!');
      localStorage.removeItem('quoteItems');
      setItems([]);
      setClientInfo({
        client_name: '',
        client_email: '',
        client_phone: '',
        client_company: '',
        notes: ''
      });
      setStep(1);
    }
  });

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    const updated = [...items];
    updated[index].quantity = newQuantity;
    updated[index].total = updated[index].unit_price * newQuantity;
    setItems(updated);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const addProduct = (product) => {
    const exists = items.find(item => item.product_id === product.id);
    if (exists) {
      toast.info('Product already added');
      return;
    }
    setItems([...items, {
      product_id: product.id,
      product_name: product.name,
      quantity: 1,
      unit_price: product.price,
      total: product.price
    }]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = subtotal * (discount / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * (tax / 100);
  const total = taxableAmount + taxAmount;

  const handleSubmit = () => {
    if (!clientInfo.client_name || !clientInfo.client_email) {
      toast.error('Please fill in required client information');
      return;
    }

    const quotationNumber = `QT-${Date.now().toString(36).toUpperCase()}`;
    
    createQuotation.mutate({
      quotation_number: quotationNumber,
      ...clientInfo,
      items,
      subtotal,
      discount_percent: discount,
      tax_percent: tax,
      total,
      valid_until: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
      status: 'draft'
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-24">
      {/* Hero */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-gold text-sm font-semibold uppercase tracking-wider">Build Your Quote</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-3">Quotation Builder</h1>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Create a customized quotation for your furniture needs. Add products, set quantities, and get your quote.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[
            { num: 1, label: 'Select Products' },
            { num: 2, label: 'Client Details' },
            { num: 3, label: 'Review & Submit' }
          ].map((s, i) => (
            <React.Fragment key={s.num}>
              <button
                onClick={() => setStep(s.num)}
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all ${
                  step === s.num 
                    ? 'bg-gold text-white' 
                    : step > s.num 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-white text-gray-500'
                }`}
              >
                <span className="w-8 h-8 rounded-full bg-current bg-opacity-20 flex items-center justify-center text-sm font-bold">
                  {s.num}
                </span>
                <span className="hidden sm:inline font-medium">{s.label}</span>
              </button>
              {i < 2 && <ArrowRight className="w-5 h-5 text-gray-300 hidden sm:block" />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {/* Current Items */}
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-gold" />
                        Selected Products ({items.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {items.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 flex items-center justify-center mb-4">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500 mb-4">No products added yet</p>
                          <Link to={createPageUrl('Products')}>
                            <Button variant="outline">Browse Products</Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {items.map((item, index) => (
                            <motion.div
                              key={item.product_id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl"
                            >
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                                <p className="text-sm text-gray-500">R{item.unit_price?.toLocaleString()} each</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(index, item.quantity - 1)}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(index, item.quantity + 1)}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="w-28 text-right">
                                <p className="font-bold">R{item.total?.toLocaleString()}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => removeItem(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Add Products */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Add More Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
                        {products.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => addProduct(product)}
                            disabled={items.some(item => item.product_id === product.id)}
                            className="flex items-center gap-4 p-4 rounded-xl border hover:border-gold hover:bg-stone-50 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                              <img
                                src={product.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{product.name}</p>
                              <p className="text-sm text-gray-500 capitalize">{product.category?.replace(/_/g, ' ')}</p>
                              <p className="font-bold text-gold">R{product.price?.toLocaleString()}</p>
                            </div>
                            <Plus className="w-5 h-5 text-gold flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-gold" />
                        Client Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="client_name">Full Name *</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                              id="client_name"
                              value={clientInfo.client_name}
                              onChange={(e) => setClientInfo({...clientInfo, client_name: e.target.value})}
                              placeholder="John Doe"
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="client_company">Company</Label>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                              id="client_company"
                              value={clientInfo.client_company}
                              onChange={(e) => setClientInfo({...clientInfo, client_company: e.target.value})}
                              placeholder="Company Name"
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="client_email">Email Address *</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                              id="client_email"
                              type="email"
                              value={clientInfo.client_email}
                              onChange={(e) => setClientInfo({...clientInfo, client_email: e.target.value})}
                              placeholder="john@example.com"
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="client_phone">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                              id="client_phone"
                              value={clientInfo.client_phone}
                              onChange={(e) => setClientInfo({...clientInfo, client_phone: e.target.value})}
                              placeholder="+1 (555) 123-4567"
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                          id="notes"
                          value={clientInfo.notes}
                          onChange={(e) => setClientInfo({...clientInfo, notes: e.target.value})}
                          placeholder="Any special requirements or notes..."
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gold" />
                        Quotation Preview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Client Info */}
                      <div className="grid sm:grid-cols-2 gap-4 p-4 bg-stone-50 rounded-xl mb-6">
                        <div>
                          <p className="text-sm text-gray-500">Client</p>
                          <p className="font-medium">{clientInfo.client_name || '-'}</p>
                          {clientInfo.client_company && <p className="text-sm text-gray-600">{clientInfo.client_company}</p>}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Contact</p>
                          <p className="font-medium">{clientInfo.client_email || '-'}</p>
                          {clientInfo.client_phone && <p className="text-sm text-gray-600">{clientInfo.client_phone}</p>}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3 mb-6">
                        {items.map((item) => (
                          <div key={item.product_id} className="flex justify-between items-center py-2 border-b">
                            <div>
                              <p className="font-medium">{item.product_name}</p>
                              <p className="text-sm text-gray-500">{item.quantity} x R{item.unit_price?.toLocaleString()}</p>
                            </div>
                            <p className="font-bold">R{item.total?.toLocaleString()}</p>
                          </div>
                        ))}
                      </div>

                      {/* Adjustments */}
                      <div className="grid sm:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-2">
                          <Label>Discount (%)</Label>
                          <div className="relative">
                            <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              value={discount}
                              onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Tax (%)</Label>
                          <div className="relative">
                            <Calculator className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              type="number"
                              min={0}
                              value={tax}
                              onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Valid Until */}
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <Calendar className="w-4 h-4" />
                        Valid until: {format(addDays(new Date(), 30), 'MMMM d, yyyy')}
                      </div>

                      {clientInfo.notes && (
                        <div className="p-4 bg-stone-50 rounded-xl mb-6">
                          <p className="text-sm text-gray-500 mb-1">Notes</p>
                          <p className="text-gray-700">{clientInfo.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-4">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button 
                  onClick={() => setStep(step + 1)} 
                  className="flex-1 bg-gold hover:bg-[#b8944d] text-white"
                  disabled={step === 1 && items.length === 0}
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  className="flex-1 bg-gold hover:bg-[#b8944d] text-white"
                  disabled={createQuotation.isPending || items.length === 0}
                >
                  {createQuotation.isPending ? 'Creating...' : 'Submit Quotation'}
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-gold" />
                    Quote Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>R{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({discount}%)</span>
                      <span>-R{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Tax ({tax}%)</span>
                    <span>R{taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-gold">R{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t space-y-2 text-sm text-gray-500">
                    <p>• {items.length} products selected</p>
                    <p>• Quote valid for 30 days</p>
                    <p>• Free shipping on orders R5,000+</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}