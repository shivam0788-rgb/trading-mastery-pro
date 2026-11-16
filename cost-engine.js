/* v0.5B: pure, offline, user-configured cost estimator. No live rates. */
(function(root){'use strict';
function num(value,name,positive=false,integer=false){if(value===null||value===undefined||String(value).trim()==='')throw Error(name+' is required.');const n=Number(value);if(!Number.isFinite(n)||n<0||(positive&&n<=0)||(integer&&!Number.isSafeInteger(n)))throw Error('Invalid '+name+'.');return n;}
function calculate(x){const buy=num(x.buy,'buy price',true),sell=num(x.sell,'sell price',true),qty=num(x.qty,'quantity',true,true);if(qty>100000000)throw Error('Quantity is too large.');
const fields=['brokerBuy','brokerSell','sttBuy','sttSell','stamp','exchange','sebi','gst','otherBuy','otherSell'];const v={};for(const f of fields){v[f]=num(x[f],f);if(['sttBuy','sttSell','stamp','exchange','sebi','gst'].includes(f)&&v[f]>100)throw Error('Invalid percentage: '+f);}
const buyTurnover=buy*qty,sellTurnover=sell*qty,turnover=buyTurnover+sellTurnover;
const breakdown={brokerBuy:v.brokerBuy,brokerSell:v.brokerSell,sttBuy:buyTurnover*v.sttBuy/100,sttSell:sellTurnover*v.sttSell/100,stamp:buyTurnover*v.stamp/100,exchange:turnover*v.exchange/100,sebi:turnover*v.sebi/100,otherBuy:v.otherBuy,otherSell:v.otherSell};
breakdown.gst=(breakdown.brokerBuy+breakdown.brokerSell+breakdown.exchange+breakdown.sebi)*v.gst/100;
const totalCharges=Object.values(breakdown).reduce((a,b)=>a+b,0),gross=sellTurnover-buyTurnover,net=gross-totalCharges;
if(![buyTurnover,sellTurnover,totalCharges,gross,net].every(Number.isFinite))throw Error('Values are too large.');
return{buyTurnover,sellTurnover,turnover,breakdown,totalCharges,gross,net};}
const api={calculate};if(typeof module==='object'&&module.exports)module.exports=api;root.TradingCostEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this);
