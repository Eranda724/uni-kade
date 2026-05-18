import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/useCart.jsx'
import API from '../../services/api'

const S = {
  card: {
    background: 'var(--bg-card)',
    borderRadius: 18,
    border: '1px solid var(--border-light)',
    boxShadow: 'var(--shadow-sm)',
    cursor: 'pointer',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  label: {
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badge: (bg, color) => ({
    background: bg,
    color,
    padding: '3px 10px',
    borderRadius: 7,
    fontSize: 12,
    fontWeight: 700,
  }),
}

function lift(e) {
  e.currentTarget.style.transform = 'translateY(-4px)'
  e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
}

function drop(e) {
  e.currentTarget.style.transform = 'translateY(0)'
  e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
}

// ─── Mock Data ──────────────────────────────────────────────────
const MOCK_SHOPS = {
  1: {
    id: 1,
    name: "Mama's Kitchen",
    category: 'Food',
    university: 'University of Moratuwa',
    rating: 4.8,
    isOpen: true,
    icon: '🍱',
  },
  2: {
    id: 2,
    name: 'Campus Prints',
    category: 'Printing',
    university: 'University of Moratuwa',
    rating: 4.6,
    isOpen: true,
    icon: '🖨️',
  },
  3: {
    id: 3,
    name: 'NoteHub',
    category: 'Stationery',
    university: 'University of Moratuwa',
    rating: 4.5,
    isOpen: false,
    icon: '📚',
  },
  4: {
    id: 4,
    name: 'Quick Bites',
    category: 'Food',
    university: 'University of Moratuwa',
    rating: 4.7,
    isOpen: true,
    icon: '🥗',
  },
  5: {
    id: 5,
    name: 'Lab Mart',
    category: 'Lab Equipment',
    university: 'University of Moratuwa',
    rating: 4.3,
    isOpen: false,
    icon: '🔬',
  },
}

const MOCK_PRODUCTS = {
  1: [
    { _id: 'p1', name: 'Rice & Curry', description: 'Steamed rice with dhal curry and your choice of vegetable or chicken curry. Served hot.', price: 190, category: 'Food', active: true, stock: 25 },
    { _id: 'p2', name: 'Kottu Roti', description: 'Chopped roti stir-fried with egg, onions, and a blend of local spices.', price: 250, category: 'Food', active: true, stock: 15 },
    { _id: 'p3', name: 'Hoppers', description: 'Crispy bowl-shaped pancakes made from fermented rice flour. Perfect for breakfast.', price: 80, category: 'Food', active: true, stock: 30 },
    { _id: 'p4', name: 'Fried Rice', description: 'Wok-tossed fried rice with eggs, vegetables, and your choice of chicken or seafood.', price: 220, category: 'Food', active: true, stock: 20 },
    { _id: 'p5', name: 'Pol Roti', description: 'Traditional coconut flatbread, crispy on the outside and soft inside. Served with curry.', price: 60, category: 'Food', active: true, stock: 40 },
    { _id: 'p6', name: 'String Hoppers', description: 'Steamed rice noodle nests served with coconut sambol and curry.', price: 130, category: 'Food', active: true, stock: 20 },
    { _id: 'p7', name: 'Pittu', description: 'Steamed cylinders of rice flour and grated coconut, served with curry.', price: 100, category: 'Food', active: false, stock: 0 },
    { _id: 'p8', name: 'Fish Curry', description: 'Fresh fish simmered in a tangy coconut milk curry with curry leaves and spices.', price: 280, category: 'Food', active: true, stock: 18 },
    { _id: 'p9', name: 'Watalappan', description: 'Traditional Sri Lankan steamed pudding with jaggery, cashews, and coconut milk.', price: 120, category: 'Food', active: true, stock: 10 },
    { _id: 'p10', name: 'Lamprais', description: 'Rice boiled in stock packed with frikkadel, chicken curry, and aubergine pickle, all wrapped in a banana leaf.', price: 350, category: 'Food', active: true, stock: 8 },
    { _id: 'p11', name: 'Appa', description: 'Traditional egg hoppers with a crispy edge and soft center. A breakfast favorite.', price: 90, category: 'Food', active: true, stock: 35 },
    { _id: 'p12', name: 'Sambol', description: 'Fresh coconut relish with chili and lime — the perfect side for any meal.', price: 40, category: 'Food', active: true, stock: 50 },
  ],
  2: [
    { _id: 'p20', name: 'B&W Print (A4)', description: 'High-quality black & white laser printing on A4 paper. Perfect for reports and assignments.', price: 10, category: 'Printing', active: true, stock: 500 },
    { _id: 'p21', name: 'Color Print (A4)', description: 'Vibrant color laser printing on glossy A4 paper. Ideal for posters and project covers.', price: 35, category: 'Printing', active: true, stock: 300 },
    { _id: 'p22', name: 'A3 B&W Print', description: 'Oversized black & white printing on A3 paper for large format documents.', price: 20, category: 'Printing', active: true, stock: 150 },
    { _id: 'p23', name: 'A3 Color Print', description: 'Full-color A3 printing with premium resolution. Great for presentations and posters.', price: 60, category: 'Printing', active: true, stock: 100 },
    { _id: 'p24', name: 'Binding (Soft Cover)', description: 'Professional soft-cover binding for assignments and thesis documents.', price: 150, category: 'Printing', active: true, stock: 60 },
    { _id: 'p25', name: 'Binding (Hard Cover)', description: 'Elegant hard-cover binding with gold foil stamping for thesis and dissertations.', price: 450, category: 'Printing', active: true, stock: 30 },
    { _id: 'p26', name: 'Lamination (A4)', description: 'Clear matte lamination for A4 documents to protect against water and wear.', price: 30, category: 'Printing', active: true, stock: 200 },
    { _id: 'p27', name: 'Photocopy (A4)', description: 'Standard A4 photocopying at high speed. Perfect for bulk document needs.', price: 5, category: 'Printing', active: true, stock: 1000 },
  ],
  3: [
    { _id: 'p40', name: 'A4 Notebook', description: '200-page ruled A4 notebook with premium quality paper. Ideal for lectures and assignments.', price: 250, category: 'Stationery', active: true, stock: 100 },
    { _id: 'p41', name: 'Mechanical Pencil Set', description: 'Set of 5 mechanical pencils with 0.5mm lead refills. Includes eraser and sharpener.', price: 350, category: 'Stationery', active: true, stock: 75 },
    { _id: 'p42', name: 'A4 Paper (500 sheets)', description: 'Premium 80gsm A4 paper in packs of 500 sheets. Perfect for printouts and notes.', price: 450, category: 'Stationery', active: true, stock: 120 },
    { _id: 'p43', name: 'Metal Ruler (30cm)', description: 'Precision 30cm stainless steel ruler with cm/mm markings. Shatterproof and durable.', price: 120, category: 'Stationery', active: true, stock: 90 },
    { _id: 'p44', name: 'Marker Pen Pack', description: 'Pack of 12 dual-tip permanent markers in assorted colors. Great for whiteboards & posters.', price: 680, category: 'Stationery', active: true, stock: 50 },
    { _id: 'p45', name: 'Sticky Notes (12 pk)', description: 'Set of 12 colorful sticky note pads in 3 sizes — never lose track of important notes.', price: 200, category: 'Stationery', active: true, stock: 150 },
    { _id: 'p46', name: 'Correction Tape', description: 'Correction tape with refillable mechanism. Clean & mess-free edits for any document.', price: 80, category: 'Stationery', active: true, stock: 200 },
    { _id: 'p47', name: 'Graph Paper Pad (100)', description: '100-sheet graph paper pad, 5mm grid. Perfect for engineering and math sketching.', price: 180, category: 'Stationery', active: true, stock: 60 },
    { _id: 'p48', name: 'Glue Stick (Pack of 3)', description: 'Washable PVA glue sticks — strong adhesion on paper, cardboard, and fabric.', price: 150, category: 'Stationery', active: true, stock: 100 },
    { _id: 'p49', name: 'Geometry Box', description: 'Complete geometry set: compass, protractor, set squares, and eraser in a sturdy metal case.', price: 290, category: 'Stationery', active: true, stock: 70 },
    { _id: 'p50', name: 'Highlighter Set', description: 'Pack of 6 pastel highlighters with chisel tips. Smudge-proof and quick-drying ink.', price: 220, category: 'Stationery', active: true, stock: 80 },
    { _id: 'p51', name: 'Colored Pencil Tin', description: 'Professional tin of 36 colored pencils, perfect for art projects and illustrations.', price: 720, category: 'Stationery', active: true, stock: 40 },
    { _id: 'p52', name: 'Scissors (Steel)', description: 'Stainless steel scissors with soft-grip handles. 17cm blade for clean precise cuts.', price: 180, category: 'Stationery', active: true, stock: 110 },
    { _id: 'p53', name: 'A5 Spiral Notebook', description: 'Hard-cover spiral notebook, 160 pages, A5 size. Fits perfectly in any backpack.', price: 190, category: 'Stationery', active: true, stock: 95 },
    { _id: 'p54', name: 'Ballpoint Pens (Box of 10)', description: 'Smooth-writing ballpoint pens with ergonomic grip handles. Waterproof and fade-resistant blue ink.', price: 300, category: 'Stationery', active: true, stock: 130 },
    { _id: 'p55', name: 'Whiteboard Marker Set', description: 'Low-odor dry-erase markers with bold tip. Set of 6 — black, blue, red, green, orange, and purple.', price: 280, category: 'Stationery', active: true, stock: 85 },
    { _id: 'p56', name: 'File Folder (Pack of 5)', description: 'A4 cardboard file folders with elastic closures. Keep your assignments organized.', price: 350, category: 'Stationery', active: true, stock: 60 },
    { _id: 'p57', name: 'Calculator (Scientific)', description: '250-function scientific calculator with a 2-line natural textbook display. Approved for exams.', price: 550, category: 'Stationery', active: true, stock: 40 },
    { _id: 'p58', name: 'Craft Paper Rolls', description: 'Decorative craft paper, 50cm wide — great for posters, wrapping, and art projects.', price: 130, category: 'Stationery', active: true, stock: 35 },
    { _id: 'p59', name: 'Rubber Bands (Large Pack)', description: 'Pack of 200 natural rubber bands in mixed sizes. A dorm-room essential you never knew you needed.', price: 60, category: 'Stationery', active: true, stock: 250 },
    { _id: 'p60', name: 'Pencil Case', description: 'Zippered canvas pencil case with mesh pockets and pen slots. Holds up to 40 stationery items.', price: 370, category: 'Stationery', active: true, stock: 55 },
    { _id: 'p61', name: 'Stapler + Staples', description: 'Heavy-duty stapler with 2000 staples included. Binds up to 50 sheets at once.', price: 290, category: 'Stationery', active: true, stock: 45 },
    { _id: 'p62', name: 'Permanent Marker Pack', description: 'Oil-based permanent marker set — writes on glass, plastic, metal, wood, and skin.', price: 260, category: 'Stationery', active: true, stock: 70 },
    { _id: 'p63', name: 'Exam Pad (A4)', description: 'Rigid A4 writing board with aluminium back — no more sore wrists during long exams.', price: 140, category: 'Stationery', active: true, stock: 65 },
  ],
  4: [
    { _id: 'p80', name: 'Kottu Roti', description: 'Chopped roti stir-fried with egg, onions, and a blend of local spices. Made fresh to order.', price: 280, category: 'Food', active: true, stock: 15 },
    { _id: 'p81', name: 'Chicken Biriyani', description: 'Aromatic spiced rice layered with tender marinated chicken and saffron — piping hot and full of flavour.', price: 350, category: 'Food', active: true, stock: 10 },
    { _id: 'p82', name: 'Chicken Wings (6pc)', description: 'Crispy fried chicken wings tossed in a spicy-peri peri glaze. Served with a side of fries.', price: 320, category: 'Food', active: true, stock: 20 },
    { _id: 'p83', name: 'Deviled Chicken', description: 'Tender chicken pieces in a tangy tomato and chili sauce — the classic Sri Lankan devilled taste.', price: 290, category: 'Food', active: true, stock: 18 },
    { _id: 'p84', name: 'Vegetable Rice & Curry', description: 'Wholesome mixed vegetable curry served with steamed rice and pol sambol.', price: 200, category: 'Food', active: true, stock: 25 },
    { _id: 'p85', name: 'Mutton Rolls (4pc)', description: 'Crunchy pastry rolls packed with spicy minced mutton filling. A crowd-pleaser.', price: 240, category: 'Food', active: true, stock: 30 },
    { _id: 'p86', name: 'Bread & Chicken Curry', description: 'Freshly baked bread paired with thick homemade chicken curry — a hearty meal any time of day.', price: 260, category: 'Food', active: true, stock: 22 },
    { _id: 'p87', name: 'Ice Coffee', description: 'Chilled coffee with condensed milk, blended to a smooth frothy perfection.', price: 110, category: 'Food', active: true, stock: 50 },
    { _id: 'p88', name: 'Fish Bun', description: 'Soft bun stuffed with a savoury spiced fish filling — the perfect grab-and-go snack.', price: 70, category: 'Food', active: true, stock: 40 },
  ],
  5: [
    { _id: 'p100', name: 'Lab Coat (Student)', description: 'Standard white cotton lab coat, knee-length, 2 pockets. Essential for all chemistry and biology practicals.', price: 850, category: 'Lab Equipment', active: true, stock: 35 },
    { _id: 'p101', name: 'Safety Goggles', description: 'Anti-scratch impact-resistant polycarbonate safety goggles. UV-protective and anti-fog coating.', price: 180, category: 'Lab Equipment', active: true, stock: 80 },
    { _id: 'p102', name: 'pH Test Strips (Box of 100)', description: 'Colour-coded universal pH testing strips — accurate from pH 1 to 14. Great for chem labs.', price: 340, category: 'Lab Equipment', active: true, stock: 45 },
    { _id: 'p103', name: 'Digital Calculator (FX-82)', description: 'Casio FX-82 scientific calculator — 274 functions with dual-line natural textbook display. Note: NOT exam-approved.', price: 950, category: 'Lab Equipment', active: true, stock: 20 },
    { _id: 'p104', name: 'Test Tube Brush', description: 'Nylon-bristle brush for cleaning test tubes and narrow lab containers up to 15mm diameter.', price: 55, category: 'Lab Equipment', active: true, stock: 100 },
    { _id: 'p105', name: 'Beaker Set (500ml)', description: 'Set of 3 borosilicate glass beakers — 500ml each. Heat-resistant up to 500°C and autoclavable.', price: 380, category: 'Lab Equipment', active: true, stock: 30 },
    { _id: 'p106', name: 'Microscope Slides (50pk)', description: '50 premium ground-edge glass microscope slides. Friction-fit surface prevents sample movement.', price: 200, category: 'Lab Equipment', active: true, stock: 50 },
    { _id: 'p107', name: 'Latex Gloves (Box of 100)', description: 'Powder-free blue nitrile exam gloves — non-sterile, puncture-resistant, and ambidextrous.', price: 280, category: 'Lab Equipment', active: true, stock: 40 },
    { _id: 'p108', name: 'Pipette Set (10 pcs)', description: 'Set of 10 graduated plastic pipettes from 1ml to 10ml. Color-coded for easy volume identification.', price: 120, category: 'Lab Equipment', active: true, stock: 60 },
    { _id: 'p109', name: 'Dissection Kit (11 pcs)', description: 'Complete 11-piece stainless steel dissection set with carrying case — probes, scalpel, forceps, scissors, and more.', price: 620, category: 'Lab Equipment', active: true, stock: 15 },
    { _id: 'p110', name: 'Burette Stand (Metal)', description: 'Adjustable-height heavy-gauge metal retort stand with a cast iron round base — holds burettes and ring clamps securely.', price: 450, category: 'Lab Equipment', active: true, stock: 20 },
    { _id: 'p111', name: 'Volumetric Flask (250ml)', description: 'Class A borosilicate glass volumetric flask with a clear etched calibration mark — accurate to ±0.12ml.', price: 220, category: 'Lab Equipment', active: true, stock: 25 },
    { _id: 'p112', name: 'Protective Forearm Sleeves', description: 'Nitrile-coated forearm guard. Provides chemical splash protection up to the elbow. One size fits all.', price: 150, category: 'Lab Equipment', active: true, stock: 35 },
    { _id: 'p113', name: 'Litmus Paper Roll (Blue)', description: 'Classic blue litmus paper on a detachable 10m roll — turns red under acidic conditions (pH < 4.5).', price: 110, category: 'Lab Equipment', active: true, stock: 55 },
    { _id: 'p114', name: 'Litmus Paper Roll (Red)', description: 'Red litmus paper roll, also 10m. Turns blue under alkaline conditions (pH > 8.3).', price: 110, category: 'Lab Equipment', active: true, stock: 55 },
    { _id: 'p115', name: 'Wire Gauze (Small)', description: '100mm fibre-glass woven wire gauze with a ceramic centre. Evenly distributes heat under Bunsen burners.', price: 75, category: 'Lab Equipment', active: true, stock: 80 },
    { _id: 'p116', name: 'Reagent Bottles (500ml x2)', description: 'Pair of 500ml glass reagent bottles with glass stoppers — ideal for storing acids, bases and solvents safely.', price: 190, category: 'Lab Equipment', active: true, stock: 40 },
    { _id: 'p117', name: 'Thermometer (-10 to 110°C)', description: 'Red alcohol lab thermometer with a ±1°C tolerance. 30cm long stem for heating flask use.', price: 160, category: 'Lab Equipment', active: true, stock: 30 },
    { _id: 'p118', name: 'Funel Set (6 sizes)', description: 'Set of 6 glossy white polypropylene funnels from 35mm to 105mm top diameter — for gravity filtration and decanting.', price: 135, category: 'Lab Equipment', active: true, stock: 45 },
    { _id: 'p119', name: 'Safety Sign Set', description: 'Set of 5 weatherproof safety/warning signs — Fire Exit, Wear PPE, No Entry, Flammable, and First Aid — suitable for wall-mount.', price: 300, category: 'Lab Equipment', active: true, stock: 20 },
    { _id: 'p120', name: 'Lab Apron (Splash-Resistant)', description: 'Full-length nylon lab apron with an adjustable neck strap. Machine-washable and chemical-resistant coating.', price: 380, category: 'Lab Equipment', active: true, stock: 28 },
    { _id: 'p121', name: 'Hot Plate (Mini)', description: 'Mini magnetic stirrer hot-plate — digital temperature control from ambient to 380°C with stirring speed adjustable from 100-2000 rpm.', price: 1100, category: 'Lab Equipment', active: true, stock: 8 },
    { _id: 'p122', name: 'Weighing Boat (Pack of 100)', description: 'HDPE disposable weighing boats — 60x35mm. Non-absorbent, anti-static, and pestle-resistant. Perfect for powdered chemicals.', price: 160, category: 'Lab Equipment', active: true, stock: 50 },
    { _id: 'p123', name: 'First Aid Box Kit', description: 'Standard campus lab first-aid kit — bandages, antiseptic, burn gel, tweezers, and a safety guide booklet included.', price: 420, category: 'Lab Equipment', active: true, stock: 12 },
    { _id: 'p124', name: 'Test Tube Rack', description: '24-slot wooden test tube rack with a varnish finish. Holds tubes of 12-25mm diameter securely.', price: 250, category: 'Lab Equipment', active: true, stock: 22 },
    { _id: 'p125', name: 'Hand Lens (10x)', description: 'Durable 10x magnification glass loupe with a 21mm lens diameter. Twist-focus barrel for sharp clarity.', price: 95, category: 'Lab Equipment', active: true, stock: 65 },
    { _id: 'p126', name: 'Cape (Lab)', description: 'Repellent anti-static cotton lab coats. elbow-length with front-around closure and 3 pockets.', price: 880, category: 'Lab Equipment', active: true, stock: 18 },
    { _id: 'p127', name: 'Electronic Balance', description: '0.01g precision compact digital weighing scale with backlit LCD , low-battery indicator and auto calibration. Suitable for chemical/apharmaceutical use. Powers with a USB port. ', price: 2650, category: 'Lab Equipment', active: true, stock: 5 },
    { _id: 'p128', name: 'Burette 25 ml', description: 'Graduated Borosilicate glass burette, 25ml. For titrations in chemistry analysis.', price: 440, category: 'Lab Equipment', active: true, stock: 10 },
    { _id: 'p129', name: 'Glass Stiring Rods 300 mm', description: 'Borosilicate 3.0mm glass stirring rods, 300 mm. For laboratory mixing and viscosity experiments.', price: 90, category: 'Lab Equipment', active: true, stock: 40 },
    { _id: 'p130', name: 'Thermometer Solid Stem (-10 to 300�C)', description: 'Solid Stem Alcohol Thermometer, 300 mm and Range from -10 to 300°C', price: 460, category: 'Lab Equipment', active: true, stock: 15 },
    { _id: 'p131', name: 'Test Tube Rubber Bung No.1 (10 Pack)', description: 'Test Tube Rubber Bungs No.1, suitable for 16mm test tubes. Pack of 10. Solid rubber with tapered shape for a perfect fit.', price: 220, category: 'Lab Equipment', active: true, stock: 55 },
    { id: 'p132', name: 'Wire Gauze (200mm)', description: 'Asbestos Wick Wire Gauze 8" | 200mm. For use with hotplates and bunsen burners in science / chemistry labs.', price: 165, category: 'Lab Equipment', active: true, stock: 35 },
    { id: 'p133', name: 'Beaker with Spout / Mouth, 250ml', description: 'Borosilicate glass, 250 ml beaker with spout. For precise measurement and lab experiments in physics, chemistry and biology.', price: 165, category: 'Lab Equipment', active: true, stock: 45 },
    { id: 'p134', name: 'Electronic Balance', description: '200 g capacity professional pocket scale with 0.01gram accuracy, tare function and backlit LCD.', price: 1280, category: 'Lab Equipment', active: true, stock: 10 },
  ],
}

export default function ShopProducts() {
  const { shopId } = useParams()
  const navigate = useNavigate()
  const { cartCount, addItem } = useCart()
  const [shop, setShop] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchShopAndProducts = async () => {
      try {
        setLoading(true)

        let shopUser, shopProducts
        const mockShop = MOCK_SHOPS[shopId]
        const isMockFallback = !mockShop

        if (!isMockFallback) {
          try {
            const [userRes, prodRes] = await Promise.all([
              API.get(`/users/${shopId}`),
              API.get(`/products/shop/${shopId}`),
            ])
            shopUser = userRes.data
            shopProducts = prodRes.data
          } catch {
            // API unavailable — fall back to mock data below
          }
        }

        if (isMockFallback || !shopUser) {
          shopUser = mockShop
          shopProducts = MOCK_PRODUCTS[shopId] || []
        }

        setShop({
          id: shopUser._id || shopUser.id || shopId,
          name: shopUser.shopName || shopUser.name || 'Unknown Shop',
          category: shopUser.category || 'General',
          university: shopUser.university || 'Your Campus',
          rating: shopUser.rating || 4.5,
          isOpen: shopUser.isOpen !== undefined
            ? shopUser.isOpen
            : shopUser.status !== 'rejected' && shopUser.status === 'approved',
          icon: shopUser.icon || (shopUser.category === 'Food' ? '🍱' : '🏪'),
          products: shopProducts.length,
        })
        setProducts(
          shopProducts.map((p) => ({
            ...p,
            shopId: shopId,
            shop: shopUser.shopName || shopUser.name || 'Unknown Shop',
          })),
        )
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load shop data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (shopId) {
      fetchShopAndProducts()
    }
  }, [shopId])

  if (loading) return <div>Loading shop...</div>
  if (error) return <div>Error: {error}</div>
  if (!shop) return <div>Shop not found</div>

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Back to Home */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() => navigate('/student/home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            border: '1.5px solid var(--border)',
            borderRadius: 10,
            background: 'var(--bg-card)',
            color: 'var(--text)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Poppins',
          }}
        >
          ← Back to Shops
        </button>
      </div>

      {/* Shop Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--secondary), #2d8a57)',
          borderRadius: 20,
          padding: '28px 32px',
          marginBottom: 28,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <p style={{ fontSize: 13, opacity: 0.75, marginBottom: 4 }}>
            🎓 {shop.university || 'Your Campus'}
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
            {shop.name}
          </h1>
          <p style={{ fontSize: 14, opacity: 0.85 }}>
            {shop.category} · {shop.products} products
          </p>
        </div>

        {/* Cart bubble */}
        <div
          onClick={() => navigate('/student/cart')}
          style={{
            position: 'relative',
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 16,
            padding: '14px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <span style={{ fontSize: 32 }}>🛒</span>
          <span style={{ fontSize: 12, fontWeight: 700 }}>
            {cartCount > 0
              ? `${cartCount} item${cartCount > 1 ? 's' : ''}`
              : 'Cart'}
          </span>
          {cartCount > 0 && (
            <div
              style={{
                position: 'absolute',
                top: -6,
                right: -6,
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'var(--primary)',
                color: '#fff',
                fontSize: 11,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {cartCount}
            </div>
          )}
        </div>
      </div>

      {/* Shop Status Badge */}
      <div style={{ marginBottom: 24 }}>
        <span
          style={S.badge(
            shop.isOpen ? 'var(--success-bg)' : 'var(--border-light)',
            shop.isOpen ? 'var(--success-text)' : 'var(--text-light)',
          )}
        >
          {shop.isOpen ? '● Open' : '○ Closed'}
        </span>
        {!shop.isOpen && (
          <span style={{ marginLeft: 10, fontSize: 13, color: 'var(--text-light)' }}>
            This shop is currently not accepting orders.
          </span>
        )}
      </div>

      {/* Products Grid */}
      <section>
        {products.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: 'var(--bg-card)',
              borderRadius: 20,
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
            <p
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--text)',
                marginBottom: 6,
              }}
            >
              No products available
            </p>
            {shop.isOpen ? (
              <p style={{ fontSize: 14, color: 'var(--text-light)' }}>
                The shop is open but has no products listed yet.
              </p>
            ) : (
              <p style={{ fontSize: 14, color: 'var(--text-light)' }}>
                The shop is currently closed.
              </p>
            )}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 20,
            }}
          >
            {products.map((product) => (
              <div
                key={product._id}
                style={{ ...S.card, padding: '24px 20px' }}
                onMouseEnter={lift}
                onMouseLeave={drop}
              >
                {/* Product Image Placeholder */}
                <div
                  style={{
                    width: 100,
                    height: 100,
                    background: 'var(--bg-hover)',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 14,
                    color: 'var(--text-muted)',
                    fontSize: 30,
                  }}
                >
                  {/* In a real app, we would show the product image here */}
                  📦
                </div>

                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: 'var(--text)',
                    marginBottom: 3,
                  }}
                >
                  {product.name}
                </div>

                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                  {product.description || 'No description available'}
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 14,
                  }}
                >
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    In stock
                  </span>
                  <span
                    style={S.badge('var(--warning-bg)', 'var(--warning-text)')}
                  >
                    Rs. {product.price}
                  </span>
                </div>

                <button
                  onClick={() => addItem(product)}
                  disabled={!shop.isOpen}
                  style={{
                    width: '100%',
                    height: 38,
                    background: shop.isOpen ? 'var(--primary)' : 'var(--border)',
                    border: 'none',
                    borderRadius: 10,
                    color: shop.isOpen ? '#fff' : 'var(--text-light)',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: shop.isOpen ? 'pointer' : 'not-allowed',
                    fontFamily: 'Poppins',
                  }}
                >
                  {shop.isOpen ? 'Add to Cart' : 'Shop Closed'}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}