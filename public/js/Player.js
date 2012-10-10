var Player = {

	displayCheaterWarning: false,

	init: function(player) {
		this.player = player;

		this.renderPlayer();
	},

	renderPlayer: function() {
		
		if(typeof this.player == 'undefined') {
			return false;
		}

		// Createn overview list
		$('.playerName').text(this.player.name);
		$('.humanity').text(this.player.humanity);
		$('.survivalTime').text(this.player.survival_time);
		$('.zombieKills').text(this.player.zombie_kills);
		$('.playerKills').text(this.player.survivor_kills);
		$('.banditKills').text(this.player.bandit_kills);
		$('.headshots').text(this.player.headshots);
		$('.position').text('[ ' + this.player.coords.x + ' | ' + this.player.coords.y + ' ]');

		// Blood
		var bloodAmount = Players.parseValues(this.player.medical)[7];
		$('.blood').text(bloodAmount);
		$('.blood').addClass( (bloodAmount > 9000) ? 'green' : 'red' )

		// Create Inventory List
		var inventoryItems = Players.parseValues(this.player.inventory);
        $('#inventory').empty();  
        $.each(inventoryItems, function(key, value) {
          $('#inventory').append('<li>' + value + '</li>');
        });

        // Create Backpack List
        var backpackItems = Players.parseValues(this.player.inventory);
        $('#backpack').empty();  
        $.each(backpackItems, function(key, value) {
          $('#backpack').append('<li>' + value + '</li>');
        });
	}
}