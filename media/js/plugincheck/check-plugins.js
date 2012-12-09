$(function() {
    var vulnerablePluginsSection = $('#sec-plugin-vulnerable'),
        unknownPluginsSection = $('#sec-plugin-unknown'),
        upToDatePluginsSection = $('#sec-plugin-uptodate'),
        vulnerablePluginsBody = $('#plugin-vulnerable'),
        unknownPluginsBody = $('#plugin-unknown'),
        upToDatePluginsBody = $('#plugin-uptodate'),
        vulnerablePluginsHtml = '',
        unknownPluginsHtml = '',
        upToDatePluginsHtml = '';

    var showPlugin = function(data) {
        // If the latest response from the service was a vulnerable plugin,
        // pass the object here.
        if(data.vulnerablePlugins) {
            vulnerablePluginsHtml = Mustache.to_html(vulnerablePluginsTmpl, data);
            vulnerablePluginsBody.append(vulnerablePluginsHtml);
            // If this section is already visible, do not
            // bother to call show and save some repainting.
            if(!vulnerablePluginsSection + ':visible') {
                vulnerablePluginsSection.show();
            }
        }

        // If the latest response from the service was an unknown plugin,
        // pass the object here.
        if(data.unknownPlugins) {
            unknownPluginsHtml = Mustache.to_html(unknownPluginsTmpl, data);
            unknownPluginsBody.append(unknownPluginsHtml);
            // If this section is already visible, do not
            // bother to call show and save some repainting.
            if(!unknownPluginsSection + ':visible') {
                unknownPluginsSection.show();
            }
        }

        // If the latest response from the service was an sweet plugin,
        // pass the object here.
        if(data.upToDatePlugins) {
            upToDatePluginsHtml = Mustache.to_html(upToDatePluginsTmpl, data);
            upToDatePluginsBody.append(upToDatePluginsHtml);
            // If this section is already visible, do not
            // bother to call show and save some repainting.
            if(!upToDatePluginsSection + ':visible') {
                upToDatePluginsSection.show();
            }
        }
    },
    unknownPluginUrl = function (pluginName) {
        return Pfs_internal[18] + encodeURI(Pfs_internal[19] + " " + pluginName);
    },
    buildObject = function(data) {
        var plugin = data.pluginInfo.raw,
            url = data.url,
            currentPlugin = {};

        if(data.status === 'outdated') {
            currentPlugin['vulnerablePlugins'] = {
                    'icon': 'default.png',
                    'plugin_name': plugin.name,
                    'plugin_detail': plugin.description,
                    'plugin_status': 'vulnerable',
                    'url': url
            };
        } else if(data.status === 'unknown') {
            currentPlugin['unknownPlugins'] = {
                    'icon': 'default.png',
                    'plugin_name': plugin.name,
                    'plugin_detail': plugin.description,
                    'plugin_status': 'unknown',
                    'url': unknownPluginUrl(plugin.name)
            };
        } else if(data.status === 'latest') {
            currentPlugin['upToDatePlugins'] = {
                    'icon': 'default.png',
                    'plugin_name': plugin.name,
                    'plugin_detail': plugin.description,
                    'plugin_status': plugin.version,
                    'url': url
            };
        }
        showPlugin(currentPlugin);
    },
    pluginCheckComplete = function() {
        console.log("pluginCheckComplete called");
    };

    checkPlugins('https://plugins.mozilla.org/pfs/v2', buildObject, pluginCheckComplete);

    if (!document.referrer || location.href.indexOf('java=1') < 0) {
        if (! PluginDetect.getVersion('Java')) {
            $('.blocklisted.java').show();
        }
    }
});