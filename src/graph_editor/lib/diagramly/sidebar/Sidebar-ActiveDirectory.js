/**
 * ten9, Inc
 * Copyright (c) 2015 - 2020 ten9, Inc
 * -----
 * NOTICE:  All information contained herein is, and remains
 * the property of ten9 Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to ten9 Incorporated
 * and its suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from ten9 Incorporated.
 * -----
 */

const {
  mxUtils,
} = require('../../jgraph/mxClient.js');

const { Sidebar } = require('../../jgraph/Sidebar.js');

(function()
{
	Sidebar.prototype.addActiveDirectoryPalette = function()
	{
		var d = 50;
		var dt = 'ibm';
		var sb = this;
		var s = 'aspect=fixed;perimeter=ellipsePerimeter;html=1;align=center;shadow=0;dashed=0;spacingTop=3;image;image=/images/lib/active_directory/';
		var gn = 'ms active directory ';
		this.setCurrentSearchEntryLibrary('active_directory');

		var fns = [
			 this.createVertexTemplateEntry(s + 'active_directory.svg;',
					 d, d * 0.85, '', 'Active Directory', false, null, this.getTagsForStencil(gn, 'active directory', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'cd_dvd.svg;',
					 d, d, '', 'CD / DVD', false, null, this.getTagsForStencil(gn, 'cd dvd compact digital video disc', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'cell_phone.svg;',
					 d * 0.42, d, '', 'Cell Phone', false, null, this.getTagsForStencil(gn, 'cell phone', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'cluster_server.svg;',
					 d, d, '', 'Cluster Server', false, null, this.getTagsForStencil(gn, 'active', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'community_discussion.svg;',
					 d, d * 0.9, '', 'Community Discussion', false, null, this.getTagsForStencil(gn, 'community discussion', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'data_jack.svg;',
					 d * 0.55, d, '', 'Data Jack', false, null, this.getTagsForStencil(gn, 'data jack', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'database.svg;',
					 d, d * 0.74, '', 'Database', false, null, this.getTagsForStencil(gn, 'database', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'database_cube.svg;',
					 d * 0.9, d, '', 'Database Cube', false, null, this.getTagsForStencil(gn, 'database cube', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'database_partition_2.svg;',
					 d, d * 0.74, '', 'Database Partition 2', false, null, this.getTagsForStencil(gn, 'database partition two', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'database_partition_3.svg;',
					 d, d * 0.74, '', 'Database Partition 3', false, null, this.getTagsForStencil(gn, 'database partition three', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'database_partition_4.svg;',
					 d, d * 0.74, '', 'Database Partition 4', false, null, this.getTagsForStencil(gn, 'database partition four', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'database_partition_5.svg;',
					 d, d * 0.74, '', 'Database Partition 5', false, null, this.getTagsForStencil(gn, 'database partition five', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'database_server.svg;',
					 d * 0.82, d, '', 'Database Server', false, null, this.getTagsForStencil(gn, 'database server', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'databases.svg;',
					 d, d * 0.98, '', 'Databases', false, null, this.getTagsForStencil(gn, 'databases', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'documents.svg;',
					 d * 0.66, d, '', 'Documents', false, null, this.getTagsForStencil(gn, 'documents', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'domain_controller.svg;',
					 d * 0.7, d, '', 'Domain Controller', false, null, this.getTagsForStencil(gn, 'domain controller', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'fax.svg;',
					 d, d * 0.75, '', 'Fax', false, null, this.getTagsForStencil(gn, 'fax', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'firewall.svg;',
					 d * 0.61, d, '', 'Firewall', false, null, this.getTagsForStencil(gn, 'firewall', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'folder.svg;',
					 d * 0.73, d, '', 'Folder', false, null, this.getTagsForStencil(gn, 'folder', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'folder_open.svg;',
					 d * 0.92, d, '', 'Folder Open', false, null, this.getTagsForStencil(gn, 'folder open', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'generic_node.svg;',
					 d, d * 0.98, '', 'Generic Node', false, null, this.getTagsForStencil(gn, 'generic node', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'generic_server.svg;',
					 d * 0.56, d, '', 'Generic Server', false, null, this.getTagsForStencil(gn, 'generic server', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'hard_disk.svg;',
					 d, d * 0.54, '', 'Hard Disk', false, null, this.getTagsForStencil(gn, 'hard disk', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'home.svg;',
					 d, d * 0.97, '', 'Home', false, null, this.getTagsForStencil(gn, 'home', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'home_page.svg;',
					 d, d * 0.9, '', 'Home Page', false, null, this.getTagsForStencil(gn, 'home page', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'input_output_filter.svg;',
					 d * 0.67, d, '', 'Input/Output Filter', false, null, this.getTagsForStencil(gn, 'input output filter io', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'interface.svg;',
					 d, d * 0.47, '', 'Interface', false, null, this.getTagsForStencil(gn, 'active', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'internet_cloud.svg;',
					 d, d * 0.63, '', 'Internet Cloud', false, null, this.getTagsForStencil(gn, 'internet cloud', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'internet_globe.svg;',
					 d, d, '', 'Internet Globe', false, null, this.getTagsForStencil(gn, 'internet globe', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'key.svg;',
					 d, d * 0.74, '', 'Key', false, null, this.getTagsForStencil(gn, 'key', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'laptop_client.svg;',
					 d * 0.9, d, '', 'Laptop Client', false, null, this.getTagsForStencil(gn, 'laptop client', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'list.svg;',
					 d * 0.7, d, '', 'List', false, null, this.getTagsForStencil(gn, 'list', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'mac_client.svg;',
					 d * 0.94, d, '', 'Mac Client', false, null, this.getTagsForStencil(gn, 'mac macintosh client', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'mainframe.svg;',
					 d, d * 0.95, '', 'Mainframe', false, null, this.getTagsForStencil(gn, 'mainframe', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'mainframe_host.svg;',
					 d * 0.72, d, '', 'Mainframe Host', false, null, this.getTagsForStencil(gn, 'mainframe host', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'meeting.svg;',
					 d, d * 0.91, '', 'Meeting', false, null, this.getTagsForStencil(gn, 'meeting', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'modem.svg;',
					 d, d * 0.83, '', 'Modem', false, null, this.getTagsForStencil(gn, 'modem', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'my_sites.svg;',
					 d, d * 0.9, '', 'My Sites', false, null, this.getTagsForStencil(gn, 'my sites', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'not_secure.svg;',
					 d * 0.88, d, '', 'Not Secure', false, null, this.getTagsForStencil(gn, 'not secure', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'pda.svg;',
					 d * 0.54, d, '', 'PDA', false, null, this.getTagsForStencil(gn, 'pda personal digital assistant', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'phone.svg;',
					 d, d * 0.79, '', 'Phone', false, null, this.getTagsForStencil(gn, 'phone', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'printer.svg;',
					 d, d * 0.66, '', 'Printer', false, null, this.getTagsForStencil(gn, 'printer', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'router.svg;',
					 d, d * 0.76, '', 'Router', false, null, this.getTagsForStencil(gn, 'router', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'secure.svg;',
					 d * 0.64, d, '', 'Secure', false, null, this.getTagsForStencil(gn, 'secure', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'security.svg;',
					 d * 0.63, d, '', 'Security', false, null, this.getTagsForStencil(gn, 'security', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'server_farm.svg;',
					 d, d, '', 'Server Farm', false, null, this.getTagsForStencil(gn, 'server farm', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'shadowed_router.svg;',
					 d * 0.82, d, '', 'Shadowed Router', false, null, this.getTagsForStencil(gn, 'shadowed router', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'site_collection.svg;',
					 d, d * 0.94, '', 'Site Collection', false, null, this.getTagsForStencil(gn, 'site collection', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'sql_server.svg;',
					 d * 0.77, d, '', 'SQL Server', false, null, this.getTagsForStencil(gn, 'sql server', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'sub_site.svg;',
					 d, d * 0.86, '', 'Sub-site', false, null, this.getTagsForStencil(gn, 'sub site', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'switch.svg;',
					 d, d, '', 'Switch', false, null, this.getTagsForStencil(gn, 'switch', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'tablet_pc.svg;',
					 d * 0.73, d, '', 'Tablet PC', false, null, this.getTagsForStencil(gn, 'tablet pc', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'tunnel.svg;',
					 d, d * 0.2, '', 'Tunnel', false, null, this.getTagsForStencil(gn, 'tunnel', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'user.svg;',
					 d * 0.37, d, '', 'User', false, null, this.getTagsForStencil(gn, 'user', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'user_accounts.svg;',
					 d, d * 0.97, '', 'User Accounts', false, null, this.getTagsForStencil(gn, 'user accounts', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'users.svg;',
					 d * 0.66, d, '', 'Users', false, null, this.getTagsForStencil(gn, 'users', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'vista_client.svg;',
					 d * 0.76, d, '', 'Vista Client', false, null, this.getTagsForStencil(gn, 'vista client', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'vista_terminal.svg;',
					 d * 0.65, d, '', 'Vista Terminal', false, null, this.getTagsForStencil(gn, 'vista terminal', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'web_server.svg;',
					 d * 0.8, d, '', 'Web Server', false, null, this.getTagsForStencil(gn, 'web server', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'wiki_site.svg;',
					 d, d, '', 'Wiki Site', false, null, this.getTagsForStencil(gn, 'wiki site', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'windows_domain.svg;',
					 d, d * 0.85, '', 'Windows Domain', false, null, this.getTagsForStencil(gn, 'windows domain', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'windows_router.svg;',
					 d * 0.8, d, '', 'Windows Router', false, null, this.getTagsForStencil(gn, 'windows router', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'windows_server.svg;',
					 d * 0.82, d, '', 'Windows Server', false, null, this.getTagsForStencil(gn, 'windows server', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'windows_server_2.svg;',
					 d * 0.8, d, '', 'Windows Server', false, null, this.getTagsForStencil(gn, 'windows server', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'wiring_hub.svg;',
					 d, d * 0.68, '', 'Wiring Hub', false, null, this.getTagsForStencil(gn, 'wiring hub', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'workspace_site.svg;',
					 d, d * 0.97, '', 'Workspace Site', false, null, this.getTagsForStencil(gn, 'workspace site', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'workstation_client.svg;',
					 d * 0.85, d, '', 'Workstation Client', false, null, this.getTagsForStencil(gn, 'workstation client', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'writer.svg;',
					 d * 0.96, d, '', 'Writer', false, null, this.getTagsForStencil(gn, 'writer', dt).join(' ')),
			 this.createVertexTemplateEntry(s + 'writing.svg;',
					 d * 0.98, d, '', 'Writing', false, null, this.getTagsForStencil(gn, 'writing', dt).join(' '))
		];

   		this.addPalette('active_directory', 'Active Directory', false, mxUtils.bind(this, function(content)
	    {
			for (var i = 0; i < fns.length; i++)
			{
				content.appendChild(fns[i](content));
			}
		}));

   		this.setCurrentSearchEntryLibrary();
	};
})();
