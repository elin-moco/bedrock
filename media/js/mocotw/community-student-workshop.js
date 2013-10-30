$(function () {
    var blogsApiUrl = '//blog.mozilla.com.tw/api/get_tag_posts?tag=%E7%8B%90%E7%8B%90%E5%B7%A5%E4%BD%9C%E5%9D%8A&nopaging=true';
    var eventsApiUrl = '//blog.mozilla.com.tw/api/get_posts?post_type=event&scope=all&s=%E7%8B%90%E7%8B%90%E5%B7%A5%E4%BD%9C%E5%9D%8A&nopaging=true';
    var events = [
        { Date: new Date("11/30/2013") },
        { Date: new Date("10/26/2013") },
        { Date: new Date("09/29/2013") },
        { Date: new Date("08/31/2013") },
        { Date: new Date("08/17/2013") },
        { Date: new Date("06/22/2013") }
    ];
    $('div.event-calendar').datepicker({
        beforeShowDay: function (date) {
            var result = [true, '', null];
            var matching = $.grep(events, function (event) {
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

                location.href='#'+$.datepicker.formatDate('mm-dd-yy', event.Date);
            }
        }});
});