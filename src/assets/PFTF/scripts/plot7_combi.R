##plot 7: all plots combination

#remove title and annotations
g5 <- g5 + theme(plot.title = element_text(size = 7, hjust = 1))
g6 <- g6 + theme(plot.title = element_text(size = 7))

#add OOA line (for first timestep after OOA detection)
if (!is.na(OOA) & latest >= OOA) {
  g1 <- g1 + geom_vline(xintercept = OOA, col ="darkgreen", size=0.5, lty = 2)
  g1 <- g1 + annotate(geom="text", x = OOA, y = 0.75*max(ylimits1), label="OOA",
                      color="darkgreen", size = 3, hjust = 1) 
  g2 <- g2 + geom_vline(xintercept = OOA, col ="darkgreen", size=0.5, lty = 2)
  g2 <- g2 + annotate(geom="text", x = OOA, y = 0.75*max(ylimits2), label="OOA",
                      color="darkgreen", size = 3, hjust = 1)
  g3 <- g3 + geom_vline(xintercept = OOA, col ="darkgreen", size=0.5, lty = 2)
  g3 <- g3 + annotate(geom="text", x = OOA, y = 3.5, label="OOA",
                      color="darkgreen", size = 3, hjust = 1)
  }

#modify common legend
g5 <- g5 +  theme(legend.title = element_text(size = basesize), legend.title.align = 1) + 
      guides(colour = guide_legend(override.aes = list(size=basesize/3)))

#combine plots g1 + g2 + g3 + g5 + g6
g7 <- ggarrange(ggarrange(g1, g2, g3, nrow = 3, ncol = 1, align = "v", heights = c(1,1,1), legend = "none"), 
                g5, g6,
                ncol = 3, nrow = 1,
                widths = c(2,5,1.3),
                common.legend = TRUE, legend = "bottom")
#show plot
print(g7)

#save plot as jpg
ggsave(paste0("combi_", w_smooth/time_factor, "_", nrow(d_alldispl), ".", file_format), device = file_format, path = main,
       width = 1.75*16, height = 1.75*9, units = "cm")
