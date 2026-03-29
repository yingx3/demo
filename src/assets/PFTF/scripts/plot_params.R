##set plot variables

#labels in English
Sys.setlocale("LC_TIME", "English")

#basesize <- the basesize for ggplots
basesize <- 13

#limits for x-axis according to latest timestamp and window_plot
xlimits <- c(latest-(window_plot*difftime(displ_data[2,1],displ_data[1,1])),
             latest)
# xlimits <- as.POSIXct(c("2025-06-01", "2025-12-31"), tz = "UTC")

# #function for x-axis breaks
# cat("Debug - xlimits:", xlimits, "\n")
# cat("Debug - xlimits[2]:", xlimits[2], "| Class:", class(xlimits[2]), "\n")
# cat("Debug - difftime:", difftime(xlimits[2], xlimits[1]), "\n")
xbreaks <- seq.POSIXt(from = floor_date(start_of_calc, "day"),
                      to = xlimits[2] + difftime(xlimits[2], xlimits[1]),
                      by = "2 days"
)
#option to add additional xbreaks
# xbreaks <- c(xbreaks, xbreaks+days(14))

#minor breaks for x-axis
xminorbreaks <- "1 day"

#function for y-axis breaks (boxplot)
ybreaks <- seq.POSIXt(from = floor_date(start_of_calc, "day"),
                      to = xlimits[2] + 10*difftime(xlimits[2], start_of_calc) ,
                      by = "2 days"
)

#option to add additional ybreaks
# ybreaks <- c(ybreaks, ybreaks+days(10), ybreaks+days(20))

#minor breaks for y-axis (boxplot)
yminorbreaks <- "12 hours"

#set color scheme
colors <- colorRampPalette(brewer.pal(12, "Paired"))(length(windows_v))
