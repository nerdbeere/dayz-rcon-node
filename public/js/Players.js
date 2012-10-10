var Players = {

	disableReload: false,

	oldPositions: {},

	playerData: {},

	warnItems: [
		'BAF_AS50_scoped',
		'Mk_48_DZ',
		'M9SD',
		'BAF_L85A2_RIS_CWS',
		'NVGoggles',
		'Binocular_Vector'
	],

	init: function() {
		this.loadSurvivors();
	    var reloadInterval = window.setInterval(this.loadSurvivors, 500);

	    $('.inspectPlayer').live('click', function() {
        	Players.inspectPlayer($(this).data('uniqueId'));
        });
	},

	loadSurvivors: function() {
		if(this.disableReload || $('.btn-group').hasClass('open')) {
        return false;
      }
      $.getJSON('/getSurvivors', function(data) {
        var body = $('<tbody>')
        $.each(data, function(key, value) {

            var row = $('<tr>');
            var name = $('<td>');
            var alive = $('<td>');
            var blood = $('<td>');

            blood.html(Players.parseValues(value.medical)[7]);

            position = $('<td>');

            name.text(value.name);
            alive.text(value.is_dead);

            var pos = Players.parseValues(value.pos);
            value.coords = {
              x: pos[1],
              y: pos[2]
            }

            var posChangeX = '';
            var posChangeY = '';
            var arrow = $('<i>');
            if(typeof Players.oldPositions[value.unique_id] != 'undefined') {
              var posValChangeX = (value.coords.x - Players.oldPositions[value.unique_id].x).toFixed(2);
              var posValChangeY = (value.coords.y - Players.oldPositions[value.unique_id].y).toFixed(2)

              //posChangeX = ' <span class="posChange">' + posValChangeX + '</span>';
              //posChangeY = ' <span class="posChange">' + posValChangeY + '</span>';
              if(posValChangeX != 0 && posValChangeY != 0 && false) {
                arrow.addClass('icon icon-arrow-up');
                arrow.css({'-webkit-transform': 'rotate(' + Players.getCompassPos({x: Players.oldPositions[value.unique_id].x, y: Players.oldPositions[value.unique_id].y}, {x: value.coords.x, y: value.coords.y}) + 'deg)'});
              }
            } 

            if((posValChangeX != 0 && posValChangeY != 0) || typeof Players.oldPositions[value.unique_id] == 'undefined') {
              Players.oldPositions[value.unique_id] = value.coords;
            }

            position.html('<span>[ ' + value.coords.x + posChangeX + ' | ' + value.coords.y + posChangeY + ' ]</span>');
            if(posValChangeX != 0 || posValChangeY != 0) {
            	position.css({'background-color': '#DDD'});
            } else {
            	position.css({'background-color': '#FFF'});
            }
            position.append(arrow);

            var inspect = $('<td>').append($('<a>').addClass('btn inspectPlayer').data('uniqueId', value.unique_id).append($('<i>').addClass('icon icon-search')));

            var displayCheaterWarning = false;

            // check Inventory List
			var inventoryItems = Players.parseValues(value.inventory);
	        $.each(inventoryItems, function(key, value) {
	          displayCheaterWarning = Players.checkItem(displayCheaterWarning, value);
	        });

	        // check Backpack List
	        var backpackItems = Players.parseValues(value.inventory);
	        $.each(backpackItems, function(key, value) {
	          displayCheaterWarning = Players.checkItem(displayCheaterWarning, value);
	        });

	        row.append(name);

	        var cheaterWarning = $('<td>');
	        if(displayCheaterWarning) {
	        	cheaterWarning = cheaterWarning.append($('<span>').addClass('label label-important').text('Check items'));
	        } 

	        row.append(cheaterWarning);

            row.append(blood);
            row.append(alive);
            row.append(position);
            row.append(inspect);

            body.append(row);
            Players.playerData[value.unique_id] = value;
        });

        $('.users tbody').remove();
        $('.users').append(body);

        Player.renderPlayer();
      });
	},

	inspectPlayer: function(uniqueId) {
		$('#sidebar #player').load('/getSurvivor', function() {
			Player.init(Players.playerData[uniqueId]);
		});
	},

	parseValues: function(val) {
		var text = val.replace(/[\[|\]|\"]/g, '');

      	return text.split(',');
	},

	getCompassPos: function(pos1, pos2) {
      var arc = (Math.atan((pos1.x - pos2.x) / (pos1.y - pos2.y)) * 180 / Math.PI);
      return arc;
    },

	checkItem: function(displayCheaterWarning, item) {
		if(this.warnItems.in(item) || displayCheaterWarning) {
			return true;
		}
		return false;
	}

};