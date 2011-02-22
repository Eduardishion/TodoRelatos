// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

//
//  CREATE CUSTOM LOADING INDICATOR
//
var indWin = null;
var actInd = null;
function showIndicator()
{
	// window container
	indWin = Titanium.UI.createWindow({
		height:150,
		width:150
	});

	// black view
	var indView = Titanium.UI.createView({
		height:150,
		width:150,
		backgroundColor:'#000',
		borderRadius:10,
		opacity:0.8
	});
	indWin.add(indView);

	// loading indicator
	actInd = Titanium.UI.createActivityIndicator({
		style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
		height:30,
		width:30
	});
	indWin.add(actInd);

	// message
	var message = Titanium.UI.createLabel({
		text:'Loading',
		color:'#fff',
		width:'auto',
		height:'auto',
		font:{fontSize:20,fontWeight:'bold'},
		bottom:20
	});
	indWin.add(message);
	indWin.open();
	actInd.show();

}

function hideIndicator()
{
	actInd.hide();
	indWin.close({opacity:0,duration:500});
}



//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({
    title:'Categorias',
    backgroundColor:'#000'
});

var categorias;

showIndicator();

if (Titanium.Network.online) {
	Titanium.Yahoo.yql('select * from html where url = "http://www.todorelatos.com/categorias/" and xpath="//*[@id=\'AutoNumber23\']/tr/td/table/tr/td/strong/a"', function(e){
		hideIndicator();

		try {
			if (e.success) {
				var enlaces = e.data.a;

				var tablacategorias = new Array();

				for (var x in enlaces) {
					Ti.API.info(enlaces[x]["href"]);
					var row = Ti.UI.createTableViewRow({
						height: 50
					});

					var label = Ti.UI.createLabel({
						text: enlaces[x]["content"],
						color: '#fff',
						shadowColor: '#900',
						shadowOffset: {
							x: 0,
							y: 1
						},
						textAlign: 'left',
						left: 10,
						font: {
							fontWeight: 'bold',
							fontSize: 15
						},
						width: 'auto',
						height: 'auto'
					});
					row.add(label);

					tablecategorias.push(row);
				}

				var tableview = Titanium.UI.createTableView({
					data: tablacategorias
				});

				// create table view event listener
				tableview.addEventListener('click', function(e){
					// event data
					var index = e.index;
					var section = e.section;
					var row = e.row;
					var rowdata = e.rowData;
					Titanium.UI.createAlertDialog({
						title: 'Table View',
						message: 'row ' + row + ' index ' + index + ' section ' + section + ' row data ' + rowdata
					}).show();
				});

				win1.add(tableview);

				win1.open();

			}
			else {
				var dialog = Titanium.UI.createAlertDialog({
					title: "No hay datos",
					message: "No se han podido localizar los datos"
				});

				if (e.message) {
					var dialog2 = Titanium.UI.createAlertDialog({
						title: "No hay datos",
						message: e.message
					});
				}
			}
		}
		catch (E) {
			var dialog3 = Titanium.UI.createAlertDialog({
				title: "No hay conexión",
				message: "Compruebe que está conectado a Internet por WIFI o 3G"
			});
		}
	});
}
else {
	var dialog = Titanium.UI.createAlertDialog({
		title: "No hay conexión",
		message: "Compruebe que está conectado a Internet por WIFI o 3G"
	});
	dialog.addEventListener('click', function(e){
		Titanium.UI.currentWindow.close();
	});
}