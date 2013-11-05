$(function () {
    $('div.event-calendar').datepicker({
        beforeShowDay: function (date) {
            var result = [true, '', null];
            var matching = $.grep(events, function (event) {
                date.setHours(0);
                event.Date.setHours(0);
                return event.Date.valueOf() === date.valueOf();
            });

            if (matching.length) {
                result = [true, 'highlight', null];
            }
            return result;
        },
        onSelect: function (dateText) {
            var date,
                selectedDate = new Date(dateText),
                i = 0,
                event = null;

            /* Determine if the user clicked an event: */
            while (i < events.length && !event) {
                date = events[i].Date;

                if (selectedDate.valueOf() === date.valueOf()) {
                    event = events[i];
                }
                i++;
            }
            if (event) {
                /* If the event is defined, perform some action here; show a tooltip, navigate to a URL, etc. */

                location.href='#'+$.datepicker.formatDate('yy-mm-dd', event.Date);
            }
        }});
});