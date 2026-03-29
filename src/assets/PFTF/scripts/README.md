# Introduction - PFTF

R-tool for prospective failure time forecasting of slope failures using inverse velocity.  
Belongs to the paper: An approach for prospective forecasting of rock slope failure time by Leinauer et al., Commun Earth Environ, [Link]  
See the paper for further details.  

Version: 1.0.0  
Last changes: 2022-08-24  
Documentation by: Johannes Leinauer (johannes.leinauer@tum.de)  
Technische Universität München, Arcisstr. 21, 80333 München, Germany  

Ideas for future changes and improvements are listed in the issues of the project.  

# Content
1.  Installation
2.  Licence
3.  Citation
4.  Demo
5.	Code structure
6.  Used resources/ packages
7.	Inputs  
7.1 Annotations to the code  
7.2	Requirements for the input data  
8.	Iterative new calculations
9.	Inverse velocity calculation
10.	Quantile calculation
11.	OOA detection 2.0
12.	Calculation of the time of failure and time to failure
13.	Plotting parameters
14.	99_New iteration

# 1. Installation
The tool requires a current version of R (version 4.1 or higher) and RStudio (version 2021.09.0 or higher) (code developed with R version 4.1.3 and RStudio version 2021.09.0), both running on Windows 10 or higher, Mac OS 11 or higher or Linux. Installation time: few minutes. Tested on Windows 10, Version 20H2.  

R: https://cran.r-project.org/
RStudio: https://www.rstudio.com/products/rstudio/download/  

To start the analysis, open the 1_1_input.R file, fill all required inputs and run the code.  

# 2. License
PFTF R-tool for prospective failure time forecasting of slope failures using inverse velocity.
Copyright (C) 2022  Johannes Leinauer, TUM

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY. See the GNU General Public License for more details
(<http://www.gnu.org/licenses/>).

# 3. Citation
Use the following two references to cite the PFTF-tool.  

Leinauer, J., Weber, S., Cicoira, A. (2023). PFTF - R-tool for prospective failure time forecasting of slope failures using inverse velocity. Version 1.0.0, 10.5281/zenodo.8010361  

Leinauer, J., Weber, S., Cicoira, A., Beutel, J., Krautblatter, M. (2023). An approach for prospective forecasting of rock slope failure time. Commun Earth Environ, [DOI]  

# 4. Demo
The PFTF-tool contains an artificial data set (`displ_data.Rda`) that can be used for a demo run of the tool. All input parameters are preset to run the tool with the demo data set with a simulation of the last 6 days. The code installs all dependencies and starts to simulate through the data. It will detect the OOA and calculate forecasts until failure (2022-03-01). All 99 plots will consecutively be saved in the plots/main subfolder.   

You only have to open the the 1_1_input.R file with RStudio and set the working directory in which the tool-files are located in line 12 of the code. Then, run the complete 1_1_input.R file. Approximate run time: 5-10 min.  

If you want to use other data, adjust the inputs according to the instructions below.

# 5. Code structure
The tool is organised in different R-scripts that are sourced from the 1_1_input.R file. The tool contains the following scripts:

| filename | description |
| ------ | ------ |
| 1_1_input.R | Input parameters and options are set here. |
| 1_1_source-file.R | All scripts are sourced in the right order within here. |
| 1_2_packages.R | Loads all required packages. |
| 1_3_dataframes.R | Creates all empty dataframe lists that are filled during calculations. |
| 1_4_log.R | Creates subdirectories for results and a log-file located in ~/plots/main. |
| 2_data-input.R | Reads displacement data and removes bad data. Simulation is done here. |
| 3_smooth-data.R | Smooths displacement data. |
| 4_calculate_v-iv.R | Calculates velocity and inverse velocity. |
| 5_qntl.R | Calculates quantiles |
| 6_OOA-detection_auto_2.R | Allows the automatic detection of OOA. |
| 7_calculate_tof.R | Calculates the forecasted time of failure. |
| 8_results.R | Saves csv-files with results for further analysis in the main plot folder. |
| plot_params.R | Contains plotting parameters used for all plots. |
| plot1_displ.R | Creates the displacement plot. |
| plot2_iv.R | Creates the inverse velocity plot. |
| plot3_OOA.R | Plots if the criteria for OOA detection are true. |
| plot4_OOAsuppl.R | Creates an auxiliary plot with plot1, plot2, and plot3. |
| plot5_life-expec.R | Creates the life expectancy plot. |
| plot6_boxplot_tof.R | Creates the boxplot of all forecasted times of failure. |
| plot7_combi.R | Creates the combination of plots 1, 2, 3, 5 and 6 (main output). |
| -- |  |
| 99_1_new-iteration_run.R | If you use the tool pre-failure and you have new data available, run this file to calculate the next iteration. |
| 99_2_new-iteration_source.R | This file will be sourced by 99_1 to calculate a new iteration. |

# 6. Used resources/ packages
The following packages are used:  
- lubridate [Garrett Grolemund, Hadley Wickham (2011). Dates and Times Made Easy with lubridate. Journal of
  Statistical Software, 40(3), 1-25. URL https://www.jstatsoft.org/v40/i03/.]
- dplyr [Hadley Wickham, Romain Fran�ois, Lionel Henry and Kirill M�ller (2021). dplyr: A Grammar of Data
  Manipulation. R package version 1.0.7. https://CRAN.R-project.org/package=dplyr]
- zoo [Achim Zeileis and Gabor Grothendieck (2005). zoo: S3 Infrastructure for Regular and Irregular Time
  Series. Journal of Statistical Software, 14(6), 1-27. doi:10.18637/jss.v014.i06]
- ggplot2 [H. Wickham. ggplot2: Elegant Graphics for Data Analysis. Springer-Verlag New York, 2016.]
- RColorBrewer [Erich Neuwirth (2014). RColorBrewer: ColorBrewer Palettes. R package version 1.1-2.
  https://CRAN.R-project.org/package=RColorBrewer]
- ggpubr [Alboukadel Kassambara (2020). ggpubr: 'ggplot2' Based Publication Ready Plots. R package version 0.4.0.
  https://CRAN.R-project.org/package=ggpubr]
- scales [Hadley Wickham and Dana Seidel (2020). scales: Scale Functions for Visualization. R package version
  1.1.1. https://CRAN.R-project.org/package=scales]
- reshape2 [Hadley Wickham (2007). Reshaping Data with the reshape Package. Journal of Statistical Software, 21(12),
  1-20. URL http://www.jstatsoft.org/v21/i12/.]  

# 7. Inputs
Belongs to: _1_1_input.R_

# 7.1 Annotations to the code
_#set working directory_  
Set the working directory in which the .R-files and the displacement data are located. Plots will be saved in a subfolder within this directory.  

_#set start of calculations_  
`start_of_calc <- as.POSIXct("YYYY-MM-DD HH:MM", tz="UTC")`  
The start of calculations, e.g. the reference date or the beginning of the data set. Necessary for later calculations.  

_#set start of simulation timestamp if you want to simulate real time before latest timestamp of displ_data_  
_#if not, set "latest" (this is importing all data)_  
`start_of_sim <- as.POSIXct("YYYY-MM-DD HH:MM", tz="UTC")` or  
`start_of_sim <- "latest"`  
The start of simulated real time. Set the time when the tool should start to simulate real time forecasting and to produce 1 plot per timestamp. If you only want one calculation with all available data, set `"latest"`  

_#set time factor for data frequency_  
_#factor to convert input frequency to unit_exp_  
_#e.g. data = 15 min, unit_exp = h --> time_factor = 4_  
_#e.g. data = 1 h, unit_exp = h --> time_factor = 1_  
`time_factor <- 1`  
Set the `time_factor` when the frequency of the input data is not full seconds, minutes, hours or days, so that units and numbers are displayed correctly.   

_#set plotting window (time span for plots in unit of unit_exp)_  
How long should the plotting window be [in unit_exp before the latest time stamp]? If unit_exp is hourly, 180 means 180 hours. Remember you might have to change the ylimits in _plot5_life-expec.R_ when needed.  

_#set smoothing windows (in unit of unit_exp))_  
Set all wanted smoothing window lengths for displacement smoothing. Note that more windows cause longer computing times.  

_#set windows for velocity calculation (in unit of unit_exp)) [supply at least 2]_  
Set all wanted window lengths for velocity calculation. Note that more windows cause longer computing times. Data within the windows are taken for linear regression. Supply at least 2 values, as statistics are calculated later.  

_#set unit factor for inverse velocity (calculation without unit factor is in h per displacement unit [e.g. h/m])_  
The unit factor is helpful to create inverse velocities in a comfortable range (e.g. between 0 and 100) depending on the unit, e.g. set 100 to convert from m to cm.  

_#set units of plotted parameters_  
`unit_displ <- "m"`  
`unit_iv <- "h/cm"`  # [iv] = h / unit_displ / unit_factor  
`unit_exp <- "h"`  # supported: "s", "min", "h", "d"  
Set the units of the calculated parameters. The units depend on the used input data and the `unit_factor`. These units will be written in the y-axis annotation and used for calculating tof and creating plot5.  

_#set file format (jpeg or pdf) in which final combi-plots are saved_  
Should the final result plot be saved as 'jpeg' or as 'pdf'? Note that R can have a bug when rendering the transparent geom_ribbon of the failure window to jpeg. No problem with pdf.  

_#set option of OOA adjustment to 'on' or 'off'_  
If you want to have the possibility to readjust the OOA during each iteration, put `"yes"`.  
If you do not want this option and do not want the tool to ask, put `"no"` (useful for simulation or automatic detection).  

_#should supplementary plots be saved? set to 'on' or 'off'_  
If `'on'`, the tool creates and saves supplementary plots with every time step. This is helpful for debugging and if single plots are wanted, but takes longer time, more disk space and creates many files (~20 per w_smooth and data row).  

_#put actual time of failure if known (post-event); if unknown put NA (pre-event)_  
In case of simulated analysis (post-event), this date is used for plotting the failure line.  

_#set OOA if already known, otherwise set NA (will be assigned later)_  
Standard is to set `NA`, then OOA is identified during analysis (real case). Setting the OOA (if already known) could be helpful in some cases.  

_#set detected bad timestamps with bad data here; if there are none set NA_  
Known bad timestamps can be set here, they will be excluded.  

_source("1_1_source-file.R")_  
This sources the next script, that sources all other scripts.  

# 7.2 Requirements to the input data
The tool uses displacement (or comparable) data as input for the analysis. That means that other data must be transformed into (relative) displacement before being read into the tool. The displacement data have to be stored in an R-data file with the name "_displ_data.Rda_" being located in the working directory folder. The _displ_data.Rda_-file has to have one row per timestamp containing all timestamps without gaps formated as POSIXct. All timesteps should be equal. Column names are "_timestamp_" and "_displ_". Missing displacement data should have `NA` values, like the following example:  
![](/img/displ_data_Rda_example.png)  

# 8. Iterative new calculations
Belongs to: _2_data_input.R_ and _3_smooth-data.R_ and _4_calculate_v-iv.R_ and _5_qntl.R_  
To save computing time, the tool calculates the displacement, velocity, inverse velocity and quantiles for all rows of the data set separately only during the first (simulated) iteration. For every updated iteration, the tool only adds one row to each dataframe, which makes the code faster.  
The expected times of failure (_7_calculate_tof.R_) are calculated for each row starting from OOA during each iteration. This is necessary because the OOA could be updated/ changed later.  

# 9. Inverse velocity calculation
Belongs to: _4_calculate_v-iv.R_  
The inverse velocity (_iv_) is calculated as reciprocal of the velocity (_v_):  _iv=1/v_.  
The velocity is calculated as the slope of a linear regression over the last n values of displacement, while n is equal to the defined velocity window (_w_v_). This means that for each given _w_v_, one corresponding velocity is calculated during each iteration.  

# 10. Quantile calculation
Belongs to: _5_qntl.R_  
The 1% and the 50% (median) quantile of all inverse velocities are calculated for each  _w_v_ and stored in dataframes in a list.

# 11. OOA detection 2.0
Belongs to: _6_OOA-detection_auto_2.R_  
The tool tries to identify the OOA based on four conditions (all conditions must be true for all timestamps within 1 smoothing window:  
- the displacement rate is increasing  
- the inverse velocity is decreasing for all _w_v_  
- the 50% quantile is decreasing for all _w_v_  
- the current inverse velocity is smaller than the 1% quantile for all _w_v_  

The OOA is assigned at the time since when all conditions are true.  

# 12. Calculation of the time of failure and time to failure
Belongs to: _7_calculate_tof.R_  
For forecast calculation purposes, the POSIXct-formatted timestamps are converted to relative numeric time difference since `start_of_calculation` and converted back later. Calculations are done in hours, so timestamps are converted to hours. This is automatic for  `unit_exp`  of "s", "min", "h", "d".  
The tool builds a linear regression containing all inverse velocities since OOA per _w_v_. Data rows with positive slopes do not give meaningful results and are erased. The relative time of failure (_tof_) corresponds to the point where the extrapolation of the linear regression (_lm_) intersects with the x-axis (_iv = 0_) and is calculated as _tof =  (intercept of lm)/(- slope of lm)_.  
The expected time to failure (_ttf_) is calculated as _ttf = tof-latest timestamp_.  

# 13. Plotting parameters
Belongs to: _all plot scripts_  
Within the _plot.params.R-file_ the following general plotting parameters are set:  
- `basesize` for letter sizes  
- `xlimits` depending on the chosen `window_plot`  
- `xbreaks` and `minor xbreaks` (e.g. every day, needs to be adjusted according to the data)  
- `ybreaks` and `minor ybreaks` (e.g. every day, needs to be adjusted according to the data)
- colour scheme for data plotting per _w_v_  

The `ylimits` and `ybreaks` have to be changed in each plot-script separately.  
All supplementary plots are saved in the _suppl_-folder if the option is on.  
All combination plots containing a displacement plot, an inverse velocity plot, a OOA criteria plot, a life expectancy plot and a boxplot with all forecasted times of failure are saved in the _main_-folder.  

# 14. 99_New iteration
Belongs to: _99_1_new_iteration_run.R_ and _99_2_new_iteration_source.R_  
If you use the tool pre-failure and you have new data available (that means that your _displ_data.Rda_ contains a new line of data), run the 99_1 file to calculate the next iteration. This file sources the 99_2 file which works like the _1_1_source-file.R_ but without simulating the time step by step. It is just adding the latest timestamp to the analysis.  
If you receive new _displ_data_ regularly (e.g. every hour), you could execute the 99_1 file automatically every hour to update the predictions. Make sure to update your forecast with every new datapoint where possible.  
