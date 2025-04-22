// Export all model files from here

import { Receipt } from './receipt.model';
import { User } from '@/api/user/models/user.model';
import { StoreBranch } from '@/api/store/models/storeBranch.model';


Receipt.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',      
});
User.hasMany(Receipt, {
  foreignKey: 'userId',
  as: 'receipts',
});


Receipt.belongsTo(StoreBranch, {
  foreignKey: 'storeId',
  as: 'branch',  
});
StoreBranch.hasMany(Receipt, {
  foreignKey: 'storeId',
  as: 'receipts',
});
