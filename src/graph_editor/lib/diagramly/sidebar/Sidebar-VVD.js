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
	Sidebar.prototype.addVVDPalette = function()
	{
		var s = 'pointerEvents=1;shadow=0;dashed=0;html=1;strokeColor=none;fillColor=#434445;aspect=fixed;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;outlineConnect=0;shape=mxgraph.vvd.';
		var s2 = 'pointerEvents=1;shadow=0;dashed=0;html=1;strokeColor=none;aspect=fixed;labelPosition=center;verticalLabelPosition=bottom;verticalAlign=top;align=center;outlineConnect=0;shape=mxgraph.vvd.';

		// Space savers
		var sb = this;
		var gn = 'mxgraph.vvd';
		var dt = 'vmware validated design';

		var w = 50;
		var h = 50;
		this.setCurrentSearchEntryLibrary('vvd');

		var fns =
		[
			this.createVertexTemplateEntry(s + 'administrator;',
					w * 0.43, h, '', 'Administrator', null, null, this.getTagsForStencil(gn, 'administrator', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'administrator;fillColor=#066A90;',
					w * 0.43, h, '', 'Infrastructure Role', null, null, this.getTagsForStencil(gn, 'administrator', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'administrator;fillColor=#65B245;',
					w * 0.43, h, '', 'Tenant Role', null, null, this.getTagsForStencil(gn, 'administrator', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'app;',
					w, h, '', 'App', null, null, this.getTagsForStencil(gn, 'app application', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'volumes_agent;',
					w * 0.98, h, '', 'Volumes Agent', null, null, this.getTagsForStencil(gn, 'volumes agent', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'appstack_volume;',
					w, h * 0.7, '', 'AppStack Volume', null, null, this.getTagsForStencil(gn, 'appstack volume', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'app_volumes_manager;',
					w * 0.97, h, '', 'App Volumes Manager', null, null, this.getTagsForStencil(gn, 'app volumes manager', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'array_manager;',
					w, h * 0.73, '', 'Array Manager', null, null, this.getTagsForStencil(gn, 'array manager', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'blueprint;',
					w, h * 0.95, '', 'Blueprint', null, null, this.getTagsForStencil(gn, 'blueprint', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'business_continuity_data_protection;',
					w, h * 0.86, '', 'Business Continuity Data Protection', null, null, this.getTagsForStencil(gn, 'business continuity data protection', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'cd;',
					w, h, '', 'CD', null, null, this.getTagsForStencil(gn, 'cd compact disc', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'cloud_computing;fillColor=#066A90;',
					w, h * 0.64, '', 'Cloud Computing', null, null, this.getTagsForStencil(gn, 'cloud computing', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'collective_nsx_esg;',
					w, h * 0.95, '', 'Collective NSX ESG', null, null, this.getTagsForStencil(gn, 'collective nsx esg', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'consumption_plane;',
					w, h, '', 'Consumption Plane', null, null, this.getTagsForStencil(gn, 'consumption plane', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'cpu;',
					w, h, '', 'CPU', null, null, this.getTagsForStencil(gn, 'cpu central processing unit', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'datacenter;',
					w, h * 0.74, '', 'Datacenter', null, null, this.getTagsForStencil(gn, 'datacenter', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'datastore;',
					w, h * 0.78, '', 'Datastore', null, null, this.getTagsForStencil(gn, 'datastore', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'disk;',
					w * 0.7, h, '', 'Disk', null, null, this.getTagsForStencil(gn, 'disk', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'document;',
					w * 0.73, h, '', 'Document', null, null, this.getTagsForStencil(gn, 'document', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'edge_gateway;',
					w, h * 0.85, '', 'Edge Gateway', null, null, this.getTagsForStencil(gn, 'edge gateway', dt).join(' ')),
			this.createVertexTemplateEntry(s2 + 'endpoint;fillColor=#ffffff;',
					w, h * 0.93, '', 'Endpoint White', null, null, this.getTagsForStencil(gn, 'endpoint', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'endpoint;',
					w, h * 0.93, '', 'Endpoint', null, null, this.getTagsForStencil(gn, 'endpoint', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'ethernet_port;',
					w, h, '', 'Ethernet Port', null, null, this.getTagsForStencil(gn, 'ethernet port', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'external_networks;',
					w, h * 0.7, '', 'External Networks', null, null, this.getTagsForStencil(gn, 'external networks', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'flash_drive;',
					w * 0.42, h, '', 'Flash Drive', null, null, this.getTagsForStencil(gn, 'flash drive', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'folder;',
					w, h * 0.76, '', 'Folder', null, null, this.getTagsForStencil(gn, 'folder', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'guest_agent_customization;',
					w, h * 0.92, '', 'Guest Agent Customization', null, null, this.getTagsForStencil(gn, 'guest agent customization', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'horizon;',
					w, h * 0.87, '', 'Horizon', null, null, this.getTagsForStencil(gn, 'horizon', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'infrastructure;',
					w, h * 0.97, '', 'Infrastructure', null, null, this.getTagsForStencil(gn, 'infrastructure', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'key;',
					w * 0.48, h, '', 'Key', null, null, this.getTagsForStencil(gn, 'key', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'tenant_key;',
					w * 0.51, h, '', 'Tenant Key', null, null, this.getTagsForStencil(gn, 'tenant key', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'keyboard;',
					w, h * 0.71, '', 'Keyboard', null, null, this.getTagsForStencil(gn, 'keyboard', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'laptop;',
					w, h * 0.72, '', 'Laptop', null, null, this.getTagsForStencil(gn, 'laptop', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'log_files;',
					w * 0.8, h, '', 'Log Files', null, null, this.getTagsForStencil(gn, 'log files', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'logical_firewall;',
					w * 0.97, h, '', 'Logical Firewall', null, null, this.getTagsForStencil(gn, 'logical firewall', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'logical_distribution;',
					w, h, '', 'Logical Distribution', null, null, this.getTagsForStencil(gn, 'logical distribution', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'machine;',
					w * 0.41, h, '', 'Machine', null, null, this.getTagsForStencil(gn, 'machine', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'memory;',
					w, h * 0.38, '', 'Memory', null, null, this.getTagsForStencil(gn, 'memory', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'monitor;',
					w, h * 0.93, '', 'Monitor', null, null, this.getTagsForStencil(gn, 'monitor', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'mouse;',
					w * 0.49, h, '', 'Mouse', null, null, this.getTagsForStencil(gn, 'mouse', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'networking;',
					w, h, '', 'Networking', null, null, this.getTagsForStencil(gn, 'networking', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'networks;',
					w, h * 0.61, '', 'Networks', null, null, this.getTagsForStencil(gn, 'networks', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'nfvo;',
					w, h, '', 'NFVO', null, null, this.getTagsForStencil(gn, 'nfvo', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'nsx;',
					w, h * 0.77, '', 'NSX', null, null, this.getTagsForStencil(gn, 'nsx', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'nsx_controller;',
					w, h, '', 'NSX Controller', null, null, this.getTagsForStencil(gn, 'nsx controller', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'nsx_dashboard;',
					w, h * 0.93, '', 'NSX Dashboard', null, null, this.getTagsForStencil(gn, 'nsx dashboard', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'nsx_edge_and_load_balancer;',
					w, h * 0.81, '', 'NSX Edge and Load Balancer', null, null, this.getTagsForStencil(gn, 'nsx edge and load balancer', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'nsx_esg;',
					w, h, '', 'NSX ESG', null, null, this.getTagsForStencil(gn, 'nsx esg', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'nsx_manager;',
					w, h, '', 'NSX Manager', null, null, this.getTagsForStencil(gn, 'nsx manager', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'nsx_public_cloud_gateway;',
					w, h * 0.95, '', 'NSX Public Cloud Gateway', null, null, this.getTagsForStencil(gn, 'nsx public cloud gateway', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'on_demand_self_service;',
					w, h * 0.85, '', 'On-demand self-service', null, null, this.getTagsForStencil(gn, 'on demand self service', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'ovdc_networks;',
					w, h * 0.61, '', 'OvDC Networks', null, null, this.getTagsForStencil(gn, 'ovdc networks', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'pair_sites;',
					w, h * 0.54, '', 'Pair Sites', null, null, this.getTagsForStencil(gn, 'pair sites', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'platform_services_controller;',
					w, h, '', 'Platform Services Controller', null, null, this.getTagsForStencil(gn, 'platform services controller', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'phone;',
					w * 0.59, h, '', 'Phone', null, null, this.getTagsForStencil(gn, 'phone', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'physical_storage;',
					w, h * 0.71, '', 'Physical Storage', null, null, this.getTagsForStencil(gn, 'physical storage', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'physical_network_adapter;',
					w, h * 0.58, '', 'Physical Network Adapter', null, null, this.getTagsForStencil(gn, 'physical network adapter', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'physical_upstream_router;',
					w, h, '', 'Physical Upstream Router', null, null, this.getTagsForStencil(gn, 'physical upstream router', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'protection_group_config;',
					w * 0.97, h, '', 'Protection Group Config', null, null, this.getTagsForStencil(gn, 'protection group config', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'protection_group;',
					w * 0.96, h, '', 'Protection Group', null, null, this.getTagsForStencil(gn, 'protection group', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'recovery_plan;',
					w * 0.73, h, '', 'Recovery Plan', null, null, this.getTagsForStencil(gn, 'recovery plan', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'resource_pool;',
					w, h, '', 'Resource Pool', null, null, this.getTagsForStencil(gn, 'resource pool', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'site_container;',
					w * 0.99, h, '', 'Site Container', null, null, this.getTagsForStencil(gn, 'site container', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'scsi_controller;',
					w, h * 0.45, '', 'SCSI Controller', null, null, this.getTagsForStencil(gn, 'scsi controller', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'security;',
					w * 0.77, h, '', 'Security', null, null, this.getTagsForStencil(gn, 'security', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'server;',
					w, h * 0.26, '', 'Server', null, null, this.getTagsForStencil(gn, 'server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'service_provider_cloud_environment;',
					w, h * 0.88, '', 'Service Provider Cloud Environment', null, null, this.getTagsForStencil(gn, 'service provider cloud environment', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'site;',
					w, h * 0.88, '', 'Site', null, null, this.getTagsForStencil(gn, 'site', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'site_recovery;',
					w * 0.94, h, '', 'Site Recovery', null, null, this.getTagsForStencil(gn, 'site recovery', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'site_recovery_functional_icon;',
					w * 0.81, h, '', 'Site Recovery Functional Icon', null, null, this.getTagsForStencil(gn, 'site recovery functional icon', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'ssd;',
					w, h * 0.71, '', 'SSD', null, null, this.getTagsForStencil(gn, 'ssd solid state drive', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'storage;',
					w * 0.75, h, '', 'Storage', null, null, this.getTagsForStencil(gn, 'storage', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'switch;',
					w, h, '', 'Switch', null, null, this.getTagsForStencil(gn, 'switch', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'telco_network;',
					w, h * 0.72, '', 'Telco Network', null, null, this.getTagsForStencil(gn, 'telco network', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'template;',
					w * 0.82, h, '', 'Template', null, null, this.getTagsForStencil(gn, 'template', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'user_group;',
					w * 0.71, h, '', 'User Group', null, null, this.getTagsForStencil(gn, 'user group', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'vapp_network;',
					w, h * 0.85, '', 'vApp Network', null, null, this.getTagsForStencil(gn, 'vapp network', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'virtual_machine;',
					w, h, '', 'Virtual Machine', null, null, this.getTagsForStencil(gn, 'virtual machine', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'virtual_switch;',
					w, h * 0.53, '', 'Virtual Switch', null, null, this.getTagsForStencil(gn, 'virtual switch', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'virtual_appliance;',
					w, h, '', 'Virtual Appliance', null, null, this.getTagsForStencil(gn, 'virtual appliance', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'vcenter_server;',
					w * 0.96, h, '', 'vCenter Server', null, null, this.getTagsForStencil(gn, 'vcenter server', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'vcloud_director;',
					w, h * 0.43, '', 'vCloud Director', null, null, this.getTagsForStencil(gn, 'vcloud director', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'vpn;',
					w, h, '', 'VPN', null, null, this.getTagsForStencil(gn, 'vpn virtual private network', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'vrealize_automation;',
					w, h, '', 'vRealize Automation', null, null, this.getTagsForStencil(gn, 'vrealize automation', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'vrealize_log_insight;',
					w, h, '', 'vRealize Log Insight', null, null, this.getTagsForStencil(gn, 'vrealize log insight', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'vrealize_operations;',
					w * 0.98, h, '', 'vRealize Operations', null, null, this.getTagsForStencil(gn, 'vrealize operations', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'vrealize_orchestrator;',
					w, h * 0.92, '', 'vRealize Orchestrator', null, null, this.getTagsForStencil(gn, 'vrealize orchestrator', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'vrops;',
					w, h, '', 'vROPs', null, null, this.getTagsForStencil(gn, 'vrops', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'vsan;',
					w * 0.87, h, '', 'vSAN', null, null, this.getTagsForStencil(gn, 'vsan', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'vshield;',
					w * 0.85, h, '', 'vShield', null, null, this.getTagsForStencil(gn, 'vshield', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'vm_group;',
					w * 0.99, h, '', 'VM Group', null, null, this.getTagsForStencil(gn, 'vm group', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'vnf_m;',
					w, h * 0.87, '', 'VNF-M', null, null, this.getTagsForStencil(gn, 'vnf', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'vxlan;',
					w, h, '', 'VXLAN', null, null, this.getTagsForStencil(gn, 'vxlan', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'writable_volume;',
					w, h * 0.81, '', 'Writable Volume', null, null, this.getTagsForStencil(gn, 'writable volume', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'wavefront;',
					w * 0.86, h, '', 'Wavefront', null, null, this.getTagsForStencil(gn, 'wavefront', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'web_browser;',
					w, h * 0.71, '', 'Web Browser', null, null, this.getTagsForStencil(gn, 'web browser', dt).join(' ')),
			this.createVertexTemplateEntry(s + 'wi_fi;',
					w, h, '', 'Wi-Fi', null, null, this.getTagsForStencil(gn, 'wi fi wifi', dt).join(' '))
		];

		this.addPalette('vvd', 'VMware Validated Design', false, mxUtils.bind(this, function(content)
				{
					for (var i = 0; i < fns.length; i++)
					{
						content.appendChild(fns[i](content));
					}
		}));

		this.setCurrentSearchEntryLibrary();
	};
})();
