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
  mxConstants,
} = require('../../jgraph/mxClient.js');

const { Sidebar } = require('../../jgraph/Sidebar.js');

(function()
{
	Sidebar.prototype.addCitrixPalette = function()
	{
		var w = 0.5;
		var h = 0.5;
		var s = mxConstants.STYLE_VERTICAL_LABEL_POSITION + '=bottom;aspect=fixed;html=1;' + mxConstants.STYLE_VERTICAL_ALIGN + '=top;strokeColor=none;align=center;outlineConnect=0;shape=mxgraph.citrix.';
		var gn = 'mxgraph.citrix';
		var dt = '';
		this.setCurrentSearchEntryLibrary('citrix');

		this.addPaletteFunctions('citrix', 'Citrix', false,
		[
			this.createVertexTemplateEntry(s + '1u_2u_server;', w * 200, h * 78.2, '', '1U 2U Server', null, null, this.getTagsForStencil(gn, '1U 2U Server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'access_card;', w * 111, h * 150, '', 'Access Card', null, null, this.getTagsForStencil(gn, 'Access Card', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'branch_repeater;', w * 200, h * 78, '', 'Branch Repeater', null, null, this.getTagsForStencil(gn, 'Branch Repeater', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'browser;', w * 95, h * 145, '', 'Browser', null, null, this.getTagsForStencil(gn, 'Browser', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'cache_server;', w * 142, h * 195, '', 'Cache Server', null, null, this.getTagsForStencil(gn, 'Cache Server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'calendar;', w * 150, h * 200, '', 'Calendar', null, null, this.getTagsForStencil(gn, 'Calendar', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'cell_phone;', w * 50, h * 120, '', 'Cell Phone', null, null, this.getTagsForStencil(gn, 'Cell Phone', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'chassis;', w * 275, h * 355, '', 'Chassis', null, null, this.getTagsForStencil(gn, 'Chassis', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'citrix_hdx;', w * 155, h * 82, '', 'Citrix HDX', null, null, this.getTagsForStencil(gn, 'Citrix HDX', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'citrix_logo;fillColor=#4E4F53;', w * 320, h * 125, '', 'Citrix Logo', null, null, this.getTagsForStencil(gn, 'Citrix Logo', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'cloud;', w * 190, h * 124, '', 'Cloud', null, null, this.getTagsForStencil(gn, 'Cloud', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'command_center;', w * 151, h * 192, '', 'Command Center', null, null, this.getTagsForStencil(gn, 'Command Center', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'database;', w * 85, h * 100, '', 'Database', null, null, this.getTagsForStencil(gn, 'Database', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'database_server;', w * 160, h * 180, '', 'Database Server', null, null, this.getTagsForStencil(gn, 'Database Server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'datacenter;', w * 255, h * 270, '', 'Datacenter', null, null, this.getTagsForStencil(gn, 'Datacenter', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'desktop;', w * 178, h * 196, '', 'Desktop', null, null, this.getTagsForStencil(gn, 'Desktop', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'desktop_web;', w * 153, h * 180, '', 'Desktop Web', null, null, this.getTagsForStencil(gn, 'Desktop Web', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'dhcp_server;', w * 152, h * 180, '', 'DHCP Server', null, null, this.getTagsForStencil(gn, 'DHCP Server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'directory_server;', w * 130, h * 177, '', 'Directory Server', null, null, this.getTagsForStencil(gn, 'Directory Server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'dns_server;', w * 153, h * 185, '', 'DNS Server', null, null, this.getTagsForStencil(gn, 'DNS Server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'document;', w * 94, h * 144, '', 'Document', null, null, this.getTagsForStencil(gn, 'Document', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'edgesight_server;', w * 153, h * 180, '', 'EdgeSight Server', null, null, this.getTagsForStencil(gn, 'EdgeSight Server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'file_server;', w * 142, h * 194, '', 'File Server', null, null, this.getTagsForStencil(gn, 'File Server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'firewall;', w * 150, h * 186, '', 'Firewall', null, null, this.getTagsForStencil(gn, 'Firewall', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'ftp_server;', w * 142, h * 194, '', 'FTP Server', null, null, this.getTagsForStencil(gn, 'FTP Server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'geolocation_database;', w * 106, h * 98, '', 'Geolocation Database', null, null, this.getTagsForStencil(gn, 'Geolocation Database', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'globe;', w * 157, h * 150, '', 'Globe', null, null, this.getTagsForStencil(gn, 'Globe', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'goto_meeting;fillColor=#FAB616;gradientColor=#E12800;gradientDirection=north;', w * 74, h * 74, '', 'GoTo Meeting', null, null, this.getTagsForStencil(gn, 'GoTo Meeting', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'government;', w * 238, h * 104, '', 'Government', null, null, this.getTagsForStencil(gn, 'Government', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'home_office;', w * 160, h * 111, '', 'Home Office', null, null, this.getTagsForStencil(gn, 'Home Office', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'hq_enterprise;', w * 184, h * 176, '', 'HQ / Enterprise', null, null, this.getTagsForStencil(gn, 'HQ Enterprise', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'inspection;', w * 140, h * 130, '', 'Inspection', null, null, this.getTagsForStencil(gn, 'Inspection', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'ip_phone;', w * 153, h * 74, '', 'IP Phone', null, null, this.getTagsForStencil(gn, 'IP Phone', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'kiosk;', w * 130, h * 170, '', 'Kiosk', null, null, this.getTagsForStencil(gn, 'Kiosk', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'laptop_1;', w * 182, h * 154, '', 'Laptop', null, null, this.getTagsForStencil(gn, 'Laptop', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'laptop_2;', w * 232, h * 173, '', 'Laptop', null, null, this.getTagsForStencil(gn, 'Laptop', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'license_server;', w * 130, h * 170, '', 'License Server', null, null, this.getTagsForStencil(gn, 'License Server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'merchandising_server;', w * 150, h * 180, '', 'Merchandising Server', null, null, this.getTagsForStencil(gn, 'Merchandising Server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'middleware;', w * 228, h * 136, '', 'Middleware', null, null, this.getTagsForStencil(gn, 'Middleware', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'netscaler_gateway;', w * 200, h * 78, '', 'NetScaler Gateway', null, null, this.getTagsForStencil(gn, 'NetScaler Gateway', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'netscaler_mpx;', w * 200, h * 78, '', 'NetScaler MPX', null, null, this.getTagsForStencil(gn, 'NetScaler MPX', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'netscaler_sdx;', w * 200, h * 95, '', 'NetScaler SDX', null, null, this.getTagsForStencil(gn, 'NetScaler SDX', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'netscaler_vpx;', w * 194, h * 72, '', 'NetScaler VPX', null, null, this.getTagsForStencil(gn, 'NetScaler VPX', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'pbx_server;', w * 130, h * 170, '', 'PBX Server', null, null, this.getTagsForStencil(gn, 'PBX Server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'pda;', w * 60, h * 122, '', 'PDA', null, null, this.getTagsForStencil(gn, 'PDA', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'podio;fillColor=#72B8DE;gradientColor=#186BA2;gradientDirection=south;', w * 74, h * 74, '', 'Podio', null, null, this.getTagsForStencil(gn, 'Podio', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'printer;', w * 140, h * 140, '', 'Printer', null, null, this.getTagsForStencil(gn, 'Printer', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'process;', w * 104, h * 124, '', 'Process', null, null, this.getTagsForStencil(gn, 'Process', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'provisioning_server;', w * 152, h * 174, '', 'Provisioning Server', null, null, this.getTagsForStencil(gn, 'Provisioning Server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'proxy_server;', w * 153, h * 180, '', 'Proxy Server', null, null, this.getTagsForStencil(gn, 'Proxy Server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'radius_server;', w * 151, h * 182, '', 'Radius Server', null, null, this.getTagsForStencil(gn, 'Radius Server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'remote_office;', w * 184, h * 83, '', 'Remote Office', null, null, this.getTagsForStencil(gn, 'Remote Office', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'reporting;', w * 123, h * 138, '', 'Reporting', null, null, this.getTagsForStencil(gn, 'Reporting', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'role_appcontroller;fillColor=#CCCCCC;gradientColor=#000000;gradientDirection=south;', w * 76, h * 76, '', 'Role AppController', null, null, this.getTagsForStencil(gn, 'Role AppController', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'role_applications;', w * 76, h * 76, '', 'Role Applications', null, null, this.getTagsForStencil(gn, 'Role Applications', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'role_cloudbridge;fillColor=#CCCCCC;gradientColor=#000000;gradientDirection=south;', w * 76, h * 76, '', 'Role CloudBridge', null, null, this.getTagsForStencil(gn, 'Role CloudBridge', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'role_desktops;fillColor=#CCCCCC;gradientColor=#000000;gradientDirection=south;', w * 76, h * 76, '', 'Role Desktops', null, null, this.getTagsForStencil(gn, 'Role Desktops', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'role_load_testing_controller;', w * 48, h * 48, '', 'Role Load Testing Controller', null, null, this.getTagsForStencil(gn, 'Role Load Testing Controller', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'role_load_testing_launcher;', w * 82, h * 76, '', 'Role Load Testing Launcher', null, null, this.getTagsForStencil(gn, 'Role Load Testing Launcher', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'role_receiver;fillColor=#CCCCCC;gradientColor=#000000;gradientDirection=south;', w * 76, h * 76, '', 'Role Receiver', null, null, this.getTagsForStencil(gn, 'Role Receiver', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'role_repeater;fillColor=#CCCCCC;gradientColor=#000000;gradientDirection=south;', w * 76, h * 76, '', 'Role Repeater', null, null, this.getTagsForStencil(gn, 'Role Repeater', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'role_secure_access;fillColor=#CCCCCC;gradientColor=#000000;gradientDirection=south;', w * 76, h * 76, '', 'Role Secure Access', null, null, this.getTagsForStencil(gn, 'Role Secure Access', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'role_security;fillColor=#CCCCCC;gradientColor=#000000;gradientDirection=south;', w * 76, h * 76, '', 'Role Security', null, null, this.getTagsForStencil(gn, 'Role Security', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'role_services;fillColor=#CCCCCC;gradientColor=#000000;gradientDirection=south;', w * 76, h * 76, '', 'Role Services', null, null, this.getTagsForStencil(gn, 'Role Services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'role_storefront;fillColor=#CCCCCC;gradientColor=#000000;gradientDirection=south;', w * 76, h * 76, '', 'Role StoreFront', null, null, this.getTagsForStencil(gn, 'Role StoreFront', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'role_storefront_services;fillColor=#CCCCCC;gradientColor=#000000;gradientDirection=south;', w * 76, h * 76, '', 'Role StoreFront Services', null, null, this.getTagsForStencil(gn, 'Role StoreFront Services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'role_synchronizer;fillColor=#CCCCCC;gradientColor=#000000;gradientDirection=south;', w * 76, h * 76, '', 'Role Synchronizer', null, null, this.getTagsForStencil(gn, 'Role Synchronizer', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'role_xenmobile;fillColor=#CCCCCC;gradientColor=#000000;gradientDirection=south;', w * 76, h * 76, '', 'Role XenMobile', null, null, this.getTagsForStencil(gn, 'Role XenMobile', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'role_xenmobile_device_manager;fillColor=#CCCCCC;gradientColor=#000000;gradientDirection=south;', w * 70, h * 76, '', 'Role XenMobile Device Manager', null, null, this.getTagsForStencil(gn, 'Role XenMobile Device Manager', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'router;', w * 110, h * 73, '', 'Router', null, null, this.getTagsForStencil(gn, 'Router', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'security;', w * 81, h * 142, '', 'Security', null, null, this.getTagsForStencil(gn, 'Security', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'sharefile;fillColor=#386510;gradientColor=#C6CF2B;gradientDirection=south;', w * 76, h * 76, '', 'ShareFile', null, null, this.getTagsForStencil(gn, 'ShareFile', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'site;', w * 214, h * 202, '', 'Site', null, null, this.getTagsForStencil(gn, 'Site', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'smtp_server;', w * 152, h * 184, '', 'SMTP Server', null, null, this.getTagsForStencil(gn, 'SMTP Server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'storefront_services;fillColor=#CCCCCC;gradientColor=#000000;gradientDirection=south;', w * 152, h * 182, '', 'Storefront Services', null, null, this.getTagsForStencil(gn, 'Storefront Services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'switch;', w * 184, h * 83, '', 'Switch', null, null, this.getTagsForStencil(gn, 'Switch', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'tablet_1;', w * 122, h * 158, '', 'Tablet', null, null, this.getTagsForStencil(gn, 'Tablet', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'tablet_2;', w * 164, h * 172, '', 'Tablet', null, null, this.getTagsForStencil(gn, 'Tablet', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'thin_client;', w * 142, h * 142, '', 'Thin Client', null, null, this.getTagsForStencil(gn, 'Thin Client', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'tower_server;', w * 130, h * 170, '', 'Tower Server', null, null, this.getTagsForStencil(gn, 'Tower Server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'users;', w * 129, h * 110, '', 'Users', null, null, this.getTagsForStencil(gn, 'Users', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'user_control;', w * 206, h * 168, '', 'User Control', null, null, this.getTagsForStencil(gn, 'User Control', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'web_server;', w * 153, h * 180, '', 'Web Server', null, null, this.getTagsForStencil(gn, 'Web Server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'web_service;', w * 126, h * 120, '', 'Web Service', null, null, this.getTagsForStencil(gn, 'Web Service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'worxenroll;fillColor=#386510;gradientColor=#C6CF2B;gradientDirection=south;', w * 76, h * 76, '', 'WorxEnroll', null, null, this.getTagsForStencil(gn, 'WorxEnroll', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'worxhome;fillColor=#DB9EFF;gradientColor=#712FA2;gradientDirection=south;', w * 76, h * 76, '', 'WorxHome', null, null, this.getTagsForStencil(gn, 'WorxHome', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'worxmail;fillColor=#112356;gradientColor=#63AFC6;gradientDirection=south;', w * 76, h * 76, '', 'WorxMail', null, null, this.getTagsForStencil(gn, 'WorxMail', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'worxweb;fillColor=#2A3437;gradientColor=#B8B9B9;gradientDirection=south;', w * 76, h * 76, '', 'WorxWeb', null, null, this.getTagsForStencil(gn, 'WorxWeb', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'xenapp_server;', w * 152, h * 178, '', 'XenApp Server', null, null, this.getTagsForStencil(gn, 'XenApp Server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'xenapp_services;', w * 152, h * 180, '', 'XenApp Services', null, null, this.getTagsForStencil(gn, 'XenApp Services', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'xenapp_web;', w * 152, h * 180, '', 'XenApp Web', null, null, this.getTagsForStencil(gn, 'XenApp Web', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'xencenter;', w * 152, h * 178, '', 'XenCenter', null, null, this.getTagsForStencil(gn, 'XenCenter', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'xenclient;', w * 182, h * 154, '', 'XenClient', null, null, this.getTagsForStencil(gn, 'XenClient', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'xenclient_synchronizer;fillColor=#CCCCCC;gradientColor=#000000;gradientDirection=south;', w * 152, h * 182, '', 'XenClient Synchronizer', null, null, this.getTagsForStencil(gn, 'Synchronizer', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'xendesktop_server;', w * 150, h * 182, '', 'XenDesktop Server', null, null, this.getTagsForStencil(gn, 'XenDesktop Server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'xenmobile;fillColor=#CCCCCC;gradientColor=#000000;gradientDirection=south;', w * 140, h * 178, '', 'XenMobile', null, null, this.getTagsForStencil(gn, 'XenMobile', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'xenserver;', w * 153, h * 180, '', 'XenServer', null, null, this.getTagsForStencil(gn, 'XenServer', dt).join(' '))
		]);

		this.setCurrentSearchEntryLibrary();
	};
})();
