var vulnerablePluginsTmpl = '{{#vulnerablePlugins}} <tr><td>' +
                        '<section>' +
                        '<img class="icon" width="60" height="60" src="/media/img/plugincheck/app-icons/{{icon}}" alt="Plugin Icon" />' +
                        '<h4 class="name">{{plugin_name}}</h4>' +
                        '<p class="plugin-detail">{{plugin_detail}}</p>' +
                        '</section></td>' +
                        '<td class="status">{{plugin_status}}</td>' +
                        '<td class="action"><a href="{{ url }}" class="button button-negative"><span>Update Now</span></a></td>' +
                        '</tr> {{/vulnerablePlugins}}',
    unknownPluginsTmpl = '{{#unknownPlugins}} <tr><td>' +
                        '<section>' +
                        '<img class="icon" width="60" height="60" src="/media/img/plugincheck/app-icons/{{icon}}" alt="Plugin Icon" />' +
                        '<h4 class="name">{{plugin_name}}</h4>' +
                        '<p class="plugin-detail">{{plugin_detail}}</p>' +
                        '</section></td>' +
                        '<td class="status">{{plugin_status}}</td>' +
                        '<td class="action"><a href="{{ url }}" class="button research"><span>Research</span></a></td>' +
                        '</tr> {{/unknownPlugins}}',
    upToDatePluginsTmpl = '{{#upToDatePlugins}} <tr><td>' +
                        '<section>' +
                        '<img class="icon" width="60" height="60" src="/media/img/plugincheck/app-icons/{{icon}}" alt="Plugin Icon" />' +
                        '<h4 class="name">{{plugin_name}}</h4>' +
                        '<p class="plugin-detail">{{plugin_detail}}</p>' +
                        '</section></td>' +
                        '<td class="status">{{plugin_status}}</td>' +
                        '<td class="action"><a href="{{ url }}" class="button insensitive"><span>Up to Date</span></a></td>' +
                        '</tr> {{/upToDatePlugins}}';
