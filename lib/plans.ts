export const PLANS = [
 {id:'free',name:'Free',price:0,tag:'A great place to start',checks:5,research:5,features:['All 10 tools','5 website checks per day','5 keyword reports per month','Branded invoices & image tools','Trend CSV analysis & content checks']},
 {id:'plus',name:'Plus',price:5,tag:'For your everyday workflow',checks:20,research:50,features:['Everything in Free','20 website checks per day','50 keyword reports per month','More room for website research','Monthly billing · cancel anytime']},
 {id:'pro',name:'Pro',price:10,tag:'For a busier business',checks:60,research:200,features:['Everything in Plus','60 website checks per day','200 keyword reports per month','Our highest research allowance','Monthly billing · cancel anytime']}
] as const;
export function planFor(id:string){return PLANS.find(p=>p.id===id)||PLANS[0]}
