const express = require('express');
const router = express.Router();


const Menu = require('../models/Menu');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Expense = require('../models/Expense');
const Staff = require('../models/Staff'); 


router.get('/categories', async (req, res) => {
  try {
    const cats = await Category.find().sort({ name: 1 });
    res.json(cats);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/categories', async (req, res) => {
  try {
    const newCat = new Category({ name: req.body.name });
    await newCat.save();
    res.json(newCat);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ msg: "Category deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});


router.get('/menu', async (req, res) => {
  try {
    const menu = await Menu.find().sort({ category: 1 });
    res.json(menu);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/menu', async (req, res) => {
  try {
    const newItem = new Menu(req.body);
    await newItem.save();
    res.json(newItem);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/menu/:id', async (req, res) => {
  try {
    const updated = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/menu/:id', async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ msg: "Item deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});


router.get('/orders', async (req, res) => {
  try {
  
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.json(newOrder);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/orders/:id', async (req, res) => {
  try {
    const updatedData = { ...req.body };
    if (req.body.status === 'paid') {
      updatedData.completedAt = new Date(); 
    }
    const updated = await Order.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(updated);
  } catch (err) { res.status(500).json({ error: err.message }); }
});


router.get('/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/expenses', async (req, res) => {
  try {
    const newExpense = new Expense(req.body);
    await newExpense.save();
    res.json(newExpense);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/expenses/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ msg: "Expense record deleted successfully" });
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});


router.get('/reports/financial', async (req, res) => {
  const { date } = req.query;
  const start = new Date(date); start.setHours(0,0,0,0);
  const end = new Date(date); end.setHours(23,59,59,999);

  try {
    const sales = await Order.find({ status: 'paid', completedAt: { $gte: start, $lte: end } });
    const expenses = await Expense.find({ createdAt: { $gte: start, $lte: end } });
    res.json({ sales, expenses });
  } catch (err) { res.status(500).json({ error: err.message }); }
});


router.get('/staffs', async (req, res) => {
  try {
   
    const staffs = await Staff.find().select('-password').sort({ createdAt: -1 });
    res.json(staffs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/staffs', async (req, res) => {
  const { staffName, username, password, role } = req.body;
  try {
    
    const existingStaff = await Staff.findOne({ username: username.toLowerCase() });
    if (existingStaff) {
      return res.status(400).json({ error: "ဤ Username သည် ရှိပြီးသားဖြစ်သဖြင့် အခြားတစ်ခု ပြောင်းပေးပါ" });
    }

    const newStaff = new Staff({
      staffName,
      username: username.toLowerCase().trim(),
      password, 
      role,
      createdAt: new Date()
    });

    await newStaff.save();
    res.json({ msg: "Staff created successfully", staff: newStaff });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/staffs/:id', async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      return res.status(404).json({ error: "ဝန်ထမ်းအကောင့် မတွေ့ပါ" });
    }
    res.json({ msg: "Staff account deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
 
    const staff = await Staff.findOne({ username: username.toLowerCase().trim() });
    
  
    if (!staff) {
      return res.status(400).json({ error: "Username သို့မဟုတ် Password မှားယွင်းနေပါသည်" });
    }

   
    if (staff.password !== password) {
      return res.status(400).json({ error: "Username သို့မဟုတ် Password မှားယွင်းနေပါသည်" });
    }

  
    const userData = {
      _id: staff._id,
      staffName: staff.staffName,
      username: staff.username,
      role: staff.role
    };

    res.json({ msg: "Login successful", user: userData });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;