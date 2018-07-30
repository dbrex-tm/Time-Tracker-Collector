(function(){
	var bulk = [];
	$('.noBorder > tbody > tr')
		.filter('tr:gt(5):not(:has(td[colspan]))')
		.each(function(i, tableRow){
			var
				$tableRow = $(tableRow),
				$rowDataSource = $tableRow.find('> td:not(:has([width="1"]))'),
				cellBulk = [];
			$rowDataSource.each(function(i, tableCell){
				var $tableCell = $(tableCell);
				if (i === 1 || i === 2 || i === 4) {
					return;
				}
				cellBulk.push($tableCell.text());
			});
			bulk.push(cellBulk);
		});
	var dateMarker;
	$(bulk).each(function(i, records) {
		$(records).each(function(i, record) {
			var record = $.trim(record);
			if (i === 0){
				if (record) {
					dateMarker = record;
				}
				records[0] = dateMarker;
			}
			else {
				records[i] = record;
			}
		});
	});
	window.bulkCollectionChain =
		_(bulk)
			.map(function(rowRecords){
				return {
					date: rowRecords[0],
					bucket: rowRecords[1],
					time: rowRecords[2],
					description: rowRecords[3]
				};
			})
			.groupBy('bucket')
			.map(function(records, bucketKey){
				var totalStatus = 'TOTALS:\n';
				var recordMessages =
					_(records)
						.groupBy('date')
						.map(function (records, dateKey) {
							var
								totalDateTiming = 0,
								message =
									dateKey + ': ' +
									(_.map(records, function(record){
										totalDateTiming = totalDateTiming + parseFloat(record.time);
										return record.description + ' (' + record.time + 'h)';
									})).join(', ');

							return {
								date: dateKey,
								dayTotal: totalDateTiming,
								message: message
							};
						})
						.value()
						.map(function(record){
							totalStatus += (record.date + ': ' + record.dayTotal + '\n');
							return record.message;
						});

				var bucketMessage = bucketKey + ':\n' + '<textarea style="padding: 8px 4px; width: 80%; height: 110px;">' + recordMessages.join(', ') +  '</textarea>';
				return bucketMessage  + '\n' + totalStatus;
			});

	var bulkCollectionContent = window.bulkCollectionContent = bulkCollectionChain.value().join('\n\n');

	console.log(bulkCollectionContent);
	$(document.body).find('.noBorder').before("<pre class=''>" + bulkCollectionContent + "</pre>");

})();