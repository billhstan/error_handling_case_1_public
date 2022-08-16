(async function() {
    const {pool} = require('./src/config/pg');
    const chalk=require('chalk');
    const util = require('util');

    const createParentBrandChildProductRecords = async ({brandId,brandName,brandURL,products}) => {
        console.log('\x1b[36m%s\x1b[0m','createParentBrandChildProductRecords method is running.')
        /**
         * createParentBrandChildProductRecords function argument uses named args with destructuring technique
         */
       

        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            console.log('>>>Creating parent brand record ', brandName);
            const insertBrandResult = await client.query(`INSERT INTO brands(brand_name,brand_url)
      VALUES ($1,$2)  RETURNING * ;`, [brandName,brandURL]);
      console.log(chalk.greenBright('Familiarize with the returned information structure'));
      console.log(chalk.blueBright(util.inspect(insertBrandResult.rows[0], showHidden=false, depth=2, colorize=true)));
      const newBrandId = insertBrandResult.rows[0].brand_id;
            let index=0;
            for(index=0;index<products.length;index++){
                let { productId,productName} = products[index];
                console.log('>>>Creating child product record ', productName);
                let insertProductResult = await client.query(`INSERT  INTO products(product_name,brand_id)
                VALUES ($1,$2);`, [productName, newBrandId]);

            }
            await client.query('COMMIT');
            return;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            await client.release();
        }
    }//End of createParentBrandChildProductRecords  method    

const data_case_study_1 =[
{brandId:0,
brandName:'NIKE',
brandURL:'https://www.nike.com',
products:[
  {productId:0,productName:'Nike Sportswear Max90'},
  {productId:0,productName:'Liverpool F.C. 2022/23 Stadium Home'},
  {productId:0,productName:'Liverpool F.C. 2022/23 Match Home'},
  {productId:0,productName:'Nike Dri-FIT ACG \'Goat Rocks'},
  {productId:0,productName:'Fadeaway T-Shirt'},
  {productId:0,productName:'Nike ESC'}
]},
{brandId:0,
    brandName:'FENDI',
    brandURL:'https://www.fendi.com',
    products:[
        {productId:0,productName:'Red nylon parka'},
        {productId:0,productName:'Multicolour silk shirt'},
        {productId:0,productName:'Multicolour nylon blouson'},
        {productId:0,productName:'Red wool blouson'},
        {productId:0,productName:'Red silk shirt'}
      ]},

    {brandId:0,
        brandName:'IROO',
        brandURL:'https://www.iroo.com',
        products:[
            {productId:0,productName:'Tweed Tweed Jacket'},
            {productId:0,productName:'Puff-sleeve faux-leather jacket'},
            {productId:0,productName:'Open-neck willow top'},
            {productId:0,productName:'Winter apricot flower print skirt'},
            {productId:0,productName:'Vintage dali print top'},
            {productId:0,productName:'Retro waist denim dress'},
            {productId:0,productName:'Pearl Letter T-Shirt'},
            {productId:0,productName:'Tic-tac-toe tweed skirt'}
          ]},
          {brandId:0,
            brandName:'UNIQLO',
            brandURL:'https://www.uniqlo.com',
            products:[
                {productId:0,productName:'Supima® Cotton Crew Neck Short-Sleeve T-Shirt'},
                {productId:0,productName:'Dry Crew Neck Short-Sleeve Color T-Shirt'},
                {productId:0,productName:'U AIRism Cotton Oversized Crew Neck T-Shirt'},
                {productId:0,productName:'Dry Color Crew Neck Short-Sleeve T-Shirt'},
                {productId:0,productName:'Dry Pique Short-Sleeve Polo Shirt'},
                {productId:0,productName:'DRY-EX Short-Sleeve Polo Shirt'}
              ]},
              {brandId:0,
                brandName:'DAZY',
                brandURL:'https://www.dazy.com',
                products:[
                    {productId:0,productName:'DAZY Lettuce Trim Wrap Tee'},
                    {productId:0,productName:'DAZY Square Neck Contrast Binding Tee'},
                    {productId:0,productName:'DAZY Solid Sweetheart Neck Crop Tee'},
                    {productId:0,productName:'DAZY Rib-knit Square Neck Tee'},
                    {productId:0,productName:'DAZY Puff Sleeve Sweetheart Neck Tee'}
                  ]}
    
]              
console.time('pg');
     for(index=0;index<data_case_study_1.length;index++){
        console.log('Creating brand and product parent child record data');
        await createParentBrandChildProductRecords(data_case_study_1[index]);
    }
    console.log(data_case_study_1);
console.timeEnd('pg');
    process.exit();
})();