import VueResoure from 'vue-resource'
import Vue from 'vue'
import App from '../App'

Vue.use(VueResoure);
var http=Vue.http;

function GET(path,success,err,obj={}){
	http.get(path,obj).then(success,err);
}
function POST(path, data, success, err) {
	// http.post(path, obj).then(success, err);
	http.post(path, data, {
		emulateJSON: true
	}).then(success, err);

}


const localPath='/static/api'
const PRE_FIX=API_ROOT;
const INDEX_INIT=PRE_FIX+'apiDishMenu&token=';




const HOTELDETAIL_INIT=PRE_FIX+'hotelDetail';
const ROOMDETAIL_INIT=PRE_FIX+'sortDetail';
const ROOMBOOK_INIT=PRE_FIX+'sortList';
const ORDERLIST_INIT=PRE_FIX+'myOrder';
const ROOMBOOK_PRICE_INIT=PRE_FIX+'getPrice';
const ORDER_POST_INIT=PRE_FIX+'saveOrder';

const CANCEL_ORDER_PATH=PRE_FIX+'cancelOrder';
const CHECK_IN_PATH=PRE_FIX+'checkin';







