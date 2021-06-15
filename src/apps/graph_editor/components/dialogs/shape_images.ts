/*
 * ten9, Inc
 * Copyright (c) 2015 - 2021 ten9, Inc
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

const sidebarGeneralImage = require('@graphEditorImages/sidebar-general.png');
const sidebarBasicImage = require('@graphEditorImages/sidebar-basic.png');
const sidebarArrows2Image = require('@graphEditorImages/sidebar-arrows2.png');
const sidebarClipartImage = require('@graphEditorImages/sidebar-clipart.png');
const sidebarFlowchartImage = require('@graphEditorImages/sidebar-flowchart.png');
const sidebarActiveDirectoryImage = require('@graphEditorImages/sidebar-active_directory.png');
const sidebarAndroidImage = require('@graphEditorImages/sidebar-android.png');
const sidebarBootstrapImage = require('@graphEditorImages/sidebar-bootstrap.png');
const sidebarC4Image = require('@graphEditorImages/sidebar-c4.png');
const sidebarAtlassianImage = require('@graphEditorImages/sidebar-atlassian.png');
const sidebarDfdImage = require('@graphEditorImages/sidebar-dfd.png');
const sidebarErImage = require('@graphEditorImages/sidebar-er.png');
const sidebarIosImage = require('@graphEditorImages/sidebar-ios.png');
const sidebarMockupsImage = require('@graphEditorImages/sidebar-mockups.png');
const sidebarSitemapImage = require('@graphEditorImages/sidebar-sitemap.png');
const sidebarUmlImage = require('@graphEditorImages/sidebar-uml.png');
const sidebarAlliedTelesisImage = require('@graphEditorImages/sidebar-allied_telesis.png');
const sidebarAws3Image = require('@graphEditorImages/sidebar-aws3.png');
const sidebarAws4bImage = require('@graphEditorImages/sidebar-aws4b.png');
const sidebarAws4Image = require('@graphEditorImages/sidebar-aws4.png');
const sidebarAws3dImage = require('@graphEditorImages/sidebar-aws3d.png');
const sidebarAzureImage = require('@graphEditorImages/sidebar-azure.png');
const sidebarMscaeImage = require('@graphEditorImages/sidebar-mscae.png');
const sidebarCiscoImage = require('@graphEditorImages/sidebar-cisco.png');
const sidebarCisco19Image = require('@graphEditorImages/sidebar-cisco19.png');
const sidebarCiscosafeImage = require('@graphEditorImages/sidebar-cisco_safe.png');
const sidebarCumulusImage = require('@graphEditorImages/sidebar-cumulus.png');
const sidebarCitrixImage = require('@graphEditorImages/sidebar-citrix.png');
const sidebarGcp2Image = require('@graphEditorImages/sidebar-gcp2.png');
const sidebarIbmImage = require('@graphEditorImages/sidebar-ibm.png');
const sidebarKubernetesImage = require('@graphEditorImages/sidebar-kubernetes.png');
const sidebarNetworkImage = require('@graphEditorImages/sidebar-network.png');
const sidebarOfficeImage = require('@graphEditorImages/sidebar-office.png');
const sidebarRackImage = require('@graphEditorImages/sidebar-rack.png');
const sidebarVeeamImage = require('@graphEditorImages/sidebar-veeam.png');
const sidebarVvdImage = require('@graphEditorImages/sidebar-vvd.png');
const sidebarArchimate3Image = require('@graphEditorImages/sidebar-archimate3.png');
const sidebarBpmnImage = require('@graphEditorImages/sidebar-bpmn.png');
const sidebarArchimateImage = require('@graphEditorImages/sidebar-archimate.png');
const sidebarSysmlImage = require('@graphEditorImages/sidebar-sysml.png');
const sidebarLeanMappingImage = require('@graphEditorImages/sidebar-leanmapping.png');
const sidebarCabinetsImage = require('@graphEditorImages/sidebar-cabinets.png');
const sidebarInfographicImage = require('@graphEditorImages/sidebar-infographic.png');
const sidebarEipImage = require('@graphEditorImages/sidebar-eip.png');
const sidebarElectricalImage = require('@graphEditorImages/sidebar-electrical.png');
const sidebarFloorPlansImage = require('@graphEditorImages/sidebar-floorplans.png');
const sidebarFluidPowerImage = require('@graphEditorImages/sidebar-fluid_power.png');
const sidebarGmdlImage = require('@graphEditorImages/sidebar-gmdl.png');
const sidebarPidImage = require('@graphEditorImages/sidebar-pid.png');
const sidebarThreatModelingImage = require('@graphEditorImages/sidebar-threatmodeling.png');
const sidebarWebIconsImage = require('@graphEditorImages/sidebar-webIcons.png');
const sidebarSignsImage = require('@graphEditorImages/sidebar-signs.png');
const sidebarUML25Image = require('@graphEditorImages/sidebar-uml25.png');

/* eslint-disable camelcase */

const images = {
  general: sidebarGeneralImage,
  basic: sidebarBasicImage,
  arrows2: sidebarArrows2Image,
  clipart: sidebarClipartImage,
  flowchart: sidebarFlowchartImage,
  active_directory: sidebarActiveDirectoryImage,
  android: sidebarAndroidImage,
  atlassian: sidebarAtlassianImage,
  bootstrap: sidebarBootstrapImage,
  c4: sidebarC4Image,
  dfd: sidebarDfdImage,
  er: sidebarErImage,
  ios: sidebarIosImage,
  mockups: sidebarMockupsImage,
  sitemap: sidebarSitemapImage,
  uml: sidebarUmlImage,
  allied_telesis: sidebarAlliedTelesisImage,
  aws3: sidebarAws3Image,
  aws4b: sidebarAws4bImage,
  aws4: sidebarAws4Image,
  aws3d: sidebarAws3dImage,
  azure2: sidebarAzureImage,
  mscae: sidebarMscaeImage,
  cisco: sidebarCiscoImage,
  cisco19: sidebarCisco19Image,
  cisco_safe: sidebarCiscosafeImage,
  cumulus: sidebarCumulusImage,
  citrix: sidebarCitrixImage,
  gcp2: sidebarGcp2Image,
  ibm: sidebarIbmImage,
  kubernetes: sidebarKubernetesImage,
  network: sidebarNetworkImage,
  office: sidebarOfficeImage,
  rack: sidebarRackImage,
  veeam2: sidebarVeeamImage,
  vvd: sidebarVvdImage,
  archimate3: sidebarArchimate3Image,
  archimate: sidebarArchimateImage,
  bpmn: sidebarBpmnImage,
  sysml: sidebarSysmlImage,
  lean_mapping: sidebarLeanMappingImage,
  cabinets: sidebarCabinetsImage,
  infographic: sidebarInfographicImage,
  eip: sidebarEipImage,
  electrical: sidebarElectricalImage,
  floorplan: sidebarFloorPlansImage,
  fluid_power: sidebarFluidPowerImage,
  gmdl: sidebarGmdlImage,
  pid: sidebarPidImage,
  threatModeling: sidebarThreatModelingImage,
  webicons: sidebarWebIconsImage,
  signs: sidebarSignsImage,
  uml25: sidebarUML25Image,
};

export function getImage(id: string) {
  return images[id];
}
