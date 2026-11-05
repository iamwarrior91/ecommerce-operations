import fs from 'node:fs/promises';
import {Workbook,SpreadsheetFile} from 'file:///C:/Users/mario/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';
const dir='C:/Users/mario/Desktop/code/CODEX/ecommerce-operations/inventory-tracker';
const w=Workbook.create();
const inv=w.worksheets.add('Inventory'), mov=w.worksheets.add('Movements'), guide=w.worksheets.add('Guide');
const dark='#243B53', amber='#FFF4D6';
function base(s,last,end){s.showGridLines=false;s.getRange(`A1:${last}${end}`).format.font={name:'Arial',size:10,color:'#243B53'};s.getRange(`A1:${last}${end}`).format.rowHeight=22;s.getRange(`A1:${last}${end}`).format.columnWidth=17;s.getRange(`A1:${last}${end}`).format.verticalAlignment='center';}
function header(s,r,last,labels){s.getRange(`A${r}:${last}${r}`).values=[labels];s.getRange(`A${r}:${last}${r}`).format={fill:dark,font:{bold:true,color:'#FFFFFF'},rowHeight:32,wrapText:true,horizontalAlignment:'center'};}
base(inv,'L',209);base(mov,'K',1005);base(guide,'F',30);
inv.tabColor=dark;
inv.getRange('A2').values=[['Inventory tracker']];inv.getRange('A2').format.font.size=16;
inv.getRange('A4:F4').values=[['Active SKUs','Available units','Low stock','Out of stock','Negative stock','Movement issues']];
inv.getRange('A5:F5').formulas=[['=COUNTA(A10:A209)','=SUM(I10:I209)','=COUNTIF(K10:K209,"LOW STOCK")','=COUNTIF(K10:K209,"OUT OF STOCK")','=COUNTIF(K10:K209,"NEGATIVE STOCK")','=COUNTIF(Movements!K6:K1005,"?*")-COUNTIF(Movements!K6:K1005,"OK")']];
inv.getRange('A5:F5').format.font={size:16,bold:true};
inv.getRange('A7').values=[['Amber cells are editable. Blue-gray cells calculate automatically. One row per unique SKU.']];
inv.getRange('A7:L7').format.font={size:10,italic:true};
header(inv,9,'L',['SKU','Product name','Category','Supplier','Opening on hand','Opening reserved','On hand','Reserved','Available','Reorder level','Status','Notes']);
inv.getRange('A10:F209').format.fill=amber;inv.getRange('J10:J209').format.fill=amber;inv.getRange('L10:L209').format.fill=amber;inv.getRange('G10:I209').format.fill='#EEF3F8';inv.getRange('K10:K209').format.fill='#EEF3F8';
inv.getRange('A:A').format.columnWidth=23;inv.getRange('B:B').format.columnWidth=29;inv.getRange('K:K').format.columnWidth=23;inv.getRange('L:L').format.columnWidth=35;
const forms=[];for(let r=10;r<=209;r++)forms.push([`=IF(A${r}="","",IF(COUNTIF($A$10:$A$209,A${r})>1,"DUPLICATE SKU",E${r}+SUMIFS(Movements!$F$6:$F$1005,Movements!$C$6:$C$1005,A${r},Movements!$K$6:$K$1005,"OK")))`,`=IF(A${r}="","",IF(COUNTIF($A$10:$A$209,A${r})>1,"DUPLICATE SKU",F${r}+SUMIFS(Movements!$G$6:$G$1005,Movements!$C$6:$C$1005,A${r},Movements!$K$6:$K$1005,"OK")))`,`=IF(A${r}="","",IF(ISNUMBER(G${r}),G${r}-H${r},""))`]);inv.getRange('G10:I209').formulas=forms;
inv.getRange('K10:K209').formulas=Array.from({length:200},(_,i)=>{let r=i+10;return [`=IF(A${r}="","",IF(COUNTIF($A$10:$A$209,A${r})>1,"DUPLICATE SKU",IF(OR(E${r}="",F${r}="",J${r}=""),"COMPLETE INPUTS",IF(OR(G${r}<0,H${r}<0,I${r}<0),"NEGATIVE STOCK",IF(I${r}=0,"OUT OF STOCK",IF(I${r}<=J${r},"LOW STOCK","IN STOCK"))))))`];});
inv.getRange('E10:J209').setNumberFormat('#,##0');
for(const col of ['E','F','J'])inv.getRange(`${col}10:${col}209`).dataValidation={rule:{type:'whole',operator:'between',formula1:0,formula2:100000000}};
inv.getRange('K10:K209').conditionalFormats.add('containsText',{text:'LOW STOCK',format:{fill:'#FFF0C2',font:{color:'#805500',bold:true}}});
for(const text of ['NEGATIVE','OUT OF STOCK','DUPLICATE','COMPLETE'])inv.getRange('K10:K209').conditionalFormats.add('containsText',{text,format:{fill:'#FDE9E7',font:{color:'#A12720',bold:true}}});
inv.tables.add('A9:L209',true,'InventoryTable');inv.freezePanes.freezeRows(9);inv.freezePanes.freezeColumns(2);
mov.getRange('A2').values=[['Stock movements']];mov.getRange('A2').format.font.size=16;
mov.getRange('A3').values=[['Append events here. Use unique Event IDs. Enter signed changes: receipts +, shipments −. See Guide.']];
header(mov,5,'K',['Event ID','Timestamp','SKU','Event type','Order / reference','On hand change','Reserved change','Source','Operator','Notes','Validation']);
mov.getRange('A6:J1005').format.fill=amber;mov.getRange('K6:K1005').format.fill='#EEF3F8';
mov.getRange('A:A').format.columnWidth=27;mov.getRange('B:B').format.columnWidth=24;mov.getRange('C:E').format.columnWidth=23;mov.getRange('J:J').format.columnWidth=34;mov.getRange('K:K').format.columnWidth=26;
mov.getRange('B6:B1005').setNumberFormat('yyyy-mm-dd hh:mm');mov.getRange('F6:G1005').setNumberFormat('+#,##0;-#,##0;0');
mov.getRange('D6:D1005').dataValidation={rule:{type:'list',values:['Reserve','Ship','Cancel','Receipt','Return','Adjustment','Sale']}};
mov.getRange('K6:K1005').formulas=Array.from({length:1000},(_,i)=>{const r=i+6;return [`=IF(COUNTA(A${r}:J${r})=0,"",IF(A${r}="","MISSING EVENT ID",IF(COUNTIF($A$6:A${r},A${r})>1,"DUPLICATE EVENT",IF(COUNTIF(Inventory!$A$10:$A$209,C${r})<>1,"UNKNOWN / DUPLICATE SKU",IF(OR(B${r}="",D${r}="",NOT(ISNUMBER(F${r})),NOT(ISNUMBER(G${r}))),"COMPLETE INPUTS","OK")))))`];});
mov.getRange('K6:K1005').conditionalFormats.addCustom('AND($K6<>"",$K6<>"OK")',{fill:'#FDE9E7',font:{color:'#A12720',bold:true}});
mov.tables.add('A5:K1005',true,'MovementTable');mov.freezePanes.freezeRows(5);mov.freezePanes.freezeColumns(3);
guide.getRange('A:A').format.columnWidth=25;guide.getRange('B:B').format.columnWidth=105;guide.getRange('A2').values=[['Using your inventory tracker']];guide.getRange('A2').format.font.size=16;
const notes=[['Setup','One stock pool per SKU. Add SKUs and products in Inventory, then enter opening on-hand, reserved and reorder quantities.'],['Opening balance','Use counts at one agreed cutover time. Append only movements occurring after that time. Enter 0 for no reserved units.'],['Daily use','Append rows to Movements. Inventory recalculates from opening balances plus valid movements. Never overwrite calculated cells.'],['Reserve an order','For 1 unit ordered: on hand change 0; reserved change +1. Available stock decreases by 1.'],['Ship that order','On hand change -1; reserved change -1. This avoids deducting available stock twice.'],['Cancel before shipping','On hand change 0; reserved change -1. Only release units that were actually reserved.'],['Receive / usable return','On hand change +quantity; reserved change 0. Add returns only after inspection and receipt.'],['Immediate sale','For sales with no reservation workflow: on hand change -quantity; reserved change 0. Do not also reserve the same sale.'],['Adjustments','Enter signed corrections after a physical count. Include a reason and operator.'],['Event IDs','One stable unique ID per event line, such as store:order:line:reserve. Repeated IDs after the first row are excluded.'],['Errors','Only OK movement rows affect stock. Resolve missing inputs, unknown SKUs and duplicates before relying on balances.'],['Automation','Not connected yet. Configure n8n to append A:J only, populate numeric deltas including zero, and use stable event IDs.'],['Concurrency','Have n8n append movements sequentially. Avoid read-then-overwrite stock counts. Reconcile against the store regularly.'],['Capacity','Prepared for 200 SKUs and 1,000 movements. Extend formulas, validations, tables and all summary ranges before exceeding these limits.'],['Google Sheets','After import, verify stock balances in Google Sheets before connecting live store events.'],['Scope','This template does not track purchase orders or incoming stock. It starts blank and contains no real store data.']];
guide.getRange('A4:B19').values=notes;guide.getRange('A4:A19').format.font.bold=true;guide.getRange('B4:B19').format.wrapText=true;guide.getRange('A4:B19').format.rowHeight=40;
// Exercise the actual calculation chain, then restore the blank template.
inv.getRange('A10:F10').values=[['TEST','Test product','','',20,0]];inv.getRange('J10').values=[[5]];
mov.getRange('A6:J6').values=[['test-reserve',46331,'TEST','Reserve','order-test',0,1,'Test','','']];
w.recalculate();if(inv.getRange('I10').values[0][0]!==19)throw Error('Reservation test failed');
mov.getRange('A7:J7').values=[['test-reserve',46331,'TEST','Reserve','order-test',0,1,'Test','','']];w.recalculate();if(inv.getRange('I10').values[0][0]!==19)throw Error('Duplicate test failed');
mov.getRange('A8:J8').values=[['test-ship',46331,'TEST','Ship','order-test',-1,-1,'Test','','']];w.recalculate();if(inv.getRange('G10').values[0][0]!==19||inv.getRange('H10').values[0][0]!==0)throw Error('Shipment test failed');
inv.getRange('A10:F10').clear({applyTo:'contents'});inv.getRange('J10').clear({applyTo:'contents'});mov.getRange('A6:J8').clear({applyTo:'contents'});w.recalculate();
console.log((await w.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!',options:{useRegex:true,maxResults:20},maxChars:2000})).ndjson);
for(const [s,range]of [['Inventory','A1:L13'],['Movements','A1:K9'],['Guide','A1:B19']]){const b=await w.render({sheetName:s,range,scale:1,format:'png'});await fs.writeFile(`${dir}/${s}.png`,new Uint8Array(await b.arrayBuffer()));}
await(await SpreadsheetFile.exportXlsx(w)).save(`${dir}/Inventory Tracker.xlsx`);
console.log('Saved. Reservation, duplicate event and shipment checks passed.');


