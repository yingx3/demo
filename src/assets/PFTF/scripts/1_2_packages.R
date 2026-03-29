##check if the required packages are installed and load them

if (suppressWarnings(!require(lubridate))) install.packages("lubridate")
library(lubridate)

if (suppressWarnings(!require(dplyr))) install.packages("dplyr")
library(dplyr)

if (suppressWarnings(!require(zoo))) install.packages("zoo")
library(zoo)

if (suppressWarnings(!require(ggplot2))) install.packages("ggplot2")
library(ggplot2)

if (suppressWarnings(!require(RColorBrewer))) install.packages("RColorBrewer")
library(RColorBrewer)

if (suppressWarnings(!require(ggpubr))) install.packages("ggpubr")
library(ggpubr)

if (suppressWarnings(!require(scales))) install.packages("scales")
library(scales)

if (suppressWarnings(!require(reshape2))) install.packages("reshape2")
library(reshape2)
